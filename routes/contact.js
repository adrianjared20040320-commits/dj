import express from "express";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    source: { type: String, default: "landing" },
    ipAddress: { type: String, select: false },
  },
  { timestamps: true, versionKey: false }
);

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

// Validaciones
const contactRules = [
  body("name").trim().notEmpty().withMessage("Nombre obligatorio")
    .isLength({ max: 100 }).escape(),
  body("phone").trim().notEmpty()
    .matches(/^\+?[0-9\s\-()]{7,20}$/).withMessage("Teléfono inválido"),
  body("email").trim().isEmail().withMessage("Correo inválido").normalizeEmail(),
];

router.post("/", contactRules, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const map = {};
    errors.array().forEach(({ path, msg }) => { if (!map[path]) map[path] = msg; });
    return res.status(422).json({ errors: map });
  }

  try {
    const { name, phone, email } = req.body;
    const ipAddress = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    await Lead.create({ name, phone, email, ipAddress });

    res.status(201).json({
      status: "success",
      message: "¡Gracias! Te contactaremos pronto.",
    });
  } catch (err) {
    next(err);
  }
});

export default router;
