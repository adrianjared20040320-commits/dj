import mongoose from "mongoose";

const eventRequestSchema = new mongoose.Schema(
  {
    // Datos cliente
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      maxlength: [100, "Nombre demasiado largo"],
      // Sanitización, solo letras, espacios y acentos
      match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Nombre contiene caracteres inválidos"],
    },
    phone: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      trim: true,
      match: [/^\+?[0-9\s\-()]{7,20}$/, "Teléfono inválido"],
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Correo inválido"],
    },

    // Detalles evento
    eventDate: {
      type: Date,
      required: [true, "La fecha del evento es obligatoria"],
      validate: {
        validator: function (val) {
          return val > new Date(); // fecha futura
        },
        message: "La fecha debe ser futura",
      },
    },
    eventType: {
      type: String,
      enum: {
        values: ["interior", "exterior"],
        message: "Tipo de evento inválido",
      },
      required: true,
    },
    hours: {
      type: Number,
      required: [true, "Las horas son obligatorias"],
      min: [5, "Mínimo 5 horas"],
      max: [24, "Máximo 24 horas"],
    },
    guestCount: {
      type: Number,
      required: [true, "El número de personas es obligatorio"],
      min: [10, "Mínimo 10 personas"],
    },
    address: {
      type: String,
      required: [true, "La dirección es obligatoria"],
      trim: true,
      maxlength: [300, "Dirección demasiado larga"],
    },

    // Paquete seleccionado
    package: {
      type: String,
      enum: ["dj", "premium", "cotizar"],
      required: true,
    },

    // Precio
    basePrice: {
      type: Number,
    },
    extraHoursPrice: {
      type: Number,
      default: 0,
    },
    guestSurcharge: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
    },

    // Estado del pedido
    status: {
      type: String,
      enum: ["pendiente", "confirmado", "en_proceso", "completado", "cancelado"],
      default: "pendiente",
    },

    // Pago
    depositPaid: {
      type: Boolean,
      default: false,
    },
    mpPaymentId: {
      type: String,
    },

    // Metadata de seguridad
    ipAddress: {
      type: String,
      select: false,
    },
    userAgent: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// CALCULA PRECIO ANTES DE GUARDAR
eventRequestSchema.pre("save", function (next) {
  const BASE_PRICES = { dj: 5500, premium: 7500 };
  const EXTRA_HOUR_PRICE = 1200;
  const GUEST_SURCHARGES = [
    { min: 10,  max: 100, extra: 0 },
    { min: 100, max: 200, extra: 3000 },
    { min: 200, max: 300, extra: 5500 },
    { min: 300, max: Infinity, extra: 7500 },
  ];

  if (this.package === "cotizar") {
    this.totalPrice = 0;
    return next();
  }

  const base = BASE_PRICES[this.package] || 0;
  const extraHours = Math.max(0, this.hours - 5) * EXTRA_HOUR_PRICE;

  const surchargeEntry = GUEST_SURCHARGES.find(
    (s) => this.guestCount >= s.min && this.guestCount < s.max
  );
  const guestSurcharge = surchargeEntry ? surchargeEntry.extra : 7500;

  this.basePrice = base;
  this.extraHoursPrice = extraHours;
  this.guestSurcharge = guestSurcharge;
  this.totalPrice = base + extraHours + guestSurcharge;

  next();
});

const EventRequest = mongoose.model("EventRequest", eventRequestSchema);
export default EventRequest;