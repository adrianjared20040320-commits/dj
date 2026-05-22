import express from "express";
import { body, validationResult } from "express-validator";
import EventRequest from "../models/EventRequest.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// VALIDACIÓN Y SANITIZACIÓN
const eventValidationRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ max: 100 }).withMessage("Nombre demasiado largo")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage("Solo letras y espacios")
    .escape(),

  body("phone")
    .trim()
    .notEmpty().withMessage("El teléfono es obligatorio")
    .matches(/^\+?[0-9\s\-()]{7,20}$/).withMessage("Teléfono inválido")
    .escape(),

  body("email")
    .trim()
    .notEmpty().withMessage("El correo es obligatorio")
    .isEmail().withMessage("Correo inválido")
    .normalizeEmail(),

  body("eventDate")
    .notEmpty().withMessage("La fecha es obligatoria")
    .isISO8601().withMessage("Formato de fecha inválido")
    .custom((val) => {
      if (new Date(val) <= new Date()) {
        throw new Error("La fecha debe ser futura");
      }
      return true;
    })
    .toDate(),

  body("eventType")
    .notEmpty().withMessage("El tipo de evento es obligatorio")
    .isIn(["interior", "exterior"]).withMessage("Tipo de evento inválido"),

  body("hours")
    .notEmpty().withMessage("Las horas son obligatorias")
    .isInt({ min: 5, max: 24 }).withMessage("Entre 5 y 24 horas")
    .toInt(),

  body("guestCount")
    .notEmpty().withMessage("El número de personas es obligatorio")
    .isInt({ min: 10 }).withMessage("Mínimo 10 personas")
    .toInt(),

  body("address")
    .trim()
    .notEmpty().withMessage("La dirección es obligatoria")
    .isLength({ max: 300 }).withMessage("Dirección demasiado larga")
    .escape(),

  body("package")
    .notEmpty().withMessage("Selecciona un paquete")
    .isIn(["dj", "premium", "cotizar"]).withMessage("Paquete inválido"),
];

// MANEJA ERRORES VALIDACIÓN
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMap = {};
    errors.array().forEach(({ path, msg }) => {
      if (!errorMap[path]) errorMap[path] = msg;
    });
    return res.status(422).json({ errors: errorMap });
  }
  next();
};

// Crea solicitud evento
router.post(
  "/",
  eventValidationRules,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const ipAddress =
        req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"] || "";

      // Toma los campos permitidos
      const {
        name, phone, email, eventDate, eventType,
        hours, guestCount, address, package: pkg,
      } = req.body;

      const eventRequest = await EventRequest.create({
        name, phone, email, eventDate, eventType,
        hours, guestCount, address, package: pkg,
        ipAddress,
        userAgent,
      });

      res.status(201).json({
        status: "success",
        message: "Solicitud enviada correctamente. Te contactaremos pronto.",
        data: {
          id: eventRequest._id,
          totalPrice: eventRequest.totalPrice,
          status: eventRequest.status,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// Lista solicitudes (admin)
router.get("/", protect, restrictTo("admin"), async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      EventRequest.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-ipAddress -userAgent"), 
      EventRequest.countDocuments(),
    ]);

    res.status(200).json({
      status: "success",
      data: { events, total, page, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// Actualizar estado (admin)
router.patch(
  "/:id/status",
  protect,
  restrictTo("admin"),
  body("status")
    .isIn(["pendiente", "confirmado", "en_proceso", "completado", "cancelado"])
    .withMessage("Estado inválido"),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const event = await EventRequest.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );

      if (!event) {
        return res.status(404).json({ error: "Solicitud no encontrada" });
      }

      res.status(200).json({ status: "success", data: event });
    } catch (err) {
      next(err);
    }
  }
);

export default router;