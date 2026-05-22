
import express from "express";
import mongoose from "mongoose";
import { protect, restrictTo } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = express.Router();

// Todas las rutas de este archivo requieren estar autenticado como admin
router.use(protect, restrictTo("admin"));

router.get("/dashboard", async (req, res, next) => {
  try {
    const EventRequest = mongoose.model("EventRequest");

    const [totalEvents, pendingEvents, totalLeads] = await Promise.all([
      EventRequest.countDocuments(),
      EventRequest.countDocuments({ status: "pendiente" }),
      mongoose.model("Lead")?.countDocuments() ?? 0,
    ]);

    // Ingresos del mes actual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await EventRequest.aggregate([
      {
        $match: {
          status: { $in: ["confirmado", "completado"] },
          createdAt: { $gte: startOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalEvents,
        pendingEvents,
        totalLeads,
        monthlyRevenue: monthlyRevenue[0]?.total ?? 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Ventas por artículo
router.get("/sales", async (req, res, next) => {
  try {
    const EventRequest = mongoose.model("EventRequest");

    const sales = await EventRequest.aggregate([
      { $match: { status: { $in: ["confirmado", "completado"] } } },
      {
        $group: {
          _id: "$package",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
          avgPrice: { $avg: "$totalPrice" },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.status(200).json({ status: "success", data: sales });
  } catch (err) {
    next(err);
  }
});

// Crea admin
router.post(
  "/users",
  [
    body("email").isEmail().normalizeEmail(),
    body("password")
      .isLength({ min: 12 }).withMessage("Mínimo 12 caracteres")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/)
      .withMessage("Debe incluir mayúsculas, minúsculas, números y símbolos"),
    body("role").optional().isIn(["admin", "editor"]),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
      const { email, password, role } = req.body;
      const user = await User.create({ email, password, role: role ?? "editor" });
      user.password = undefined;
      res.status(201).json({ status: "success", data: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "Ya existe un usuario con ese correo." });
      }
      next(err);
    }
  }
);

export default router;