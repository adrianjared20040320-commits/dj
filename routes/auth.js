import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { createSendToken, logout, protect } from "../middleware/auth.js";

const router = express.Router();

// Validacion login
const loginRules = [
  body("email")
    .trim()
    .isEmail().withMessage("Correo inválido")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria")
    .isLength({ max: 128 }).withMessage("Contraseña demasiado larga"),
];

router.post("/login", loginRules, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Credenciales inválidas." });
  }

  try {
    const { email, password } = req.body;

    // Busca usuario
    const user = await User.findOne({ email }).select(
      "+password +loginAttempts +lockUntil"
    );

    // Si cuenta = bloqueada
    if (user?.isLocked) {
      return res.status(423).json({
        error: "Cuenta bloqueada por múltiples intentos fallidos. Intenta en 2 horas.",
      });
    }

    // Verifica credenciales
    if (!user || !(await user.correctPassword(password))) {
      // Registra intento fallido
      if (user) await user.incLoginAttempts();
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // Resetear intentos y envia token
    await user.resetLoginAttempts();
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
});

router.post("/logout", protect, logout);

// Verifica sesión activa
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    status: "success",
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

export default router;