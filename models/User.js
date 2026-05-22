import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Correo inválido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [12, "Mínimo 12 caracteres"],
      select: false, // NUNCA retorna el password en queries
    },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "editor",
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    // Bloqueo intentos fallidos
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Date,
      select: false,
    },
    // Token de reset de contraseña
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// CONSTANTES BLOQUEO
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 horas en ms

// ¿Esta bloqueada la cuenta?
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash de contraseña antes de guardar
userSchema.pre("save", async function (next) {
  // Solo hashear si fue modificada
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Actualizar passwordChangedAt
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Filtra usuarios inactivos
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// METODOS
// Verifica contraseña
userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Verifica si el password cambio después del JWT
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

// Intento fallido / bloquear cuenta
userSchema.methods.incLoginAttempts = async function () {
  // Si el bloqueo ya expiró, resetea contadores
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const update = { $inc: { loginAttempts: 1 } };

  // Bloquea si se alcanza MAX_ATTEMPTS y no está bloqueado
  if (this.loginAttempts + 1 >= MAX_ATTEMPTS && !this.isLocked) {
    update.$set = { lockUntil: Date.now() + LOCK_TIME };
  }

  return this.updateOne(update);
};

// Resetea intentos fallidos al loguearse bien
userSchema.methods.resetLoginAttempts = async function () {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

const User = mongoose.model("User", userSchema);
export default User;