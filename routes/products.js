import express from "express";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// Modelo
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, maxlength: 2000 },
    dimensions: { type: String, trim: true, maxlength: 200 },
    photos: [{ type: String }],
    tags: [{ type: String, trim: true }],
    colors: [{ type: String, trim: true }],
    amazonLink: {
      type: String,
      trim: true,
      match: [/^https:\/\/(www\.)?amazon\.(com(\.mx)?|mx)\//, "Link de Amazon inválido"],
    },
    deliveryOptions: {
      homeDelivery: { type: Boolean, default: true },
      freeZoneKm: { type: Number, default: 5 },
      cdmxPrice: { type: Number, default: 200 },
      interiorCotizar: { type: Boolean, default: true },
    },
    customMeasures: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// Lista productos (público)
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({ active: true })
      .select("-active")
      .sort({ createdAt: -1 });

    res.status(200).json({ status: "success", data: products });
  } catch (err) {
    next(err);
  }
});

// Detalles (público)
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).select("-active");
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.status(200).json({ status: "success", data: product });
  } catch (err) {
    next(err);
  }
});

// Crea producto (admin)
router.post(
  "/",
  protect,
  restrictTo("admin"),
  [
    body("name").trim().notEmpty().isLength({ max: 150 }).escape(),
    body("price").isFloat({ min: 0 }).withMessage("Precio inválido").toFloat(),
    body("description").optional().trim().isLength({ max: 2000 }).escape(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const { name, price, description, dimensions, tags, colors, amazonLink, deliveryOptions, customMeasures } = req.body;
      const product = await Product.create({ name, price, description, dimensions, tags, colors, amazonLink, deliveryOptions, customMeasures });
      res.status(201).json({ status: "success", data: product });
    } catch (err) {
      next(err);
    }
  }
);

export default router;