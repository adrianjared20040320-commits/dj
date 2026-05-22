import express from "express";
import mongoose from "mongoose";
import { protect, restrictTo } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Modelo
const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },   // HTML sanitizado
    excerpt: { type: String, maxlength: 300 },
    coverImage: { type: String },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);

// Articulos
router.get("/", async (req, res, next) => {
  try {
    const articles = await Article.find({ published: true })
      .select("title slug excerpt coverImage tags createdAt")
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json({ status: "success", data: articles });
  } catch (err) { next(err); }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      published: true,
    });
    if (!article) return res.status(404).json({ error: "Artículo no encontrado" });
    res.status(200).json({ status: "success", data: article });
  } catch (err) { next(err); }
});

// Crea artículo (admin)
router.post(
  "/",
  protect,
  restrictTo("admin", "editor"),
  [
    body("title").trim().notEmpty().isLength({ max: 200 }).escape(),
    body("slug").trim().notEmpty().toLowerCase().matches(/^[a-z0-9-]+$/),
    body("content").notEmpty(),
    body("excerpt").optional().trim().isLength({ max: 300 }).escape(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    try {
      const { title, slug, content, excerpt, coverImage, tags, published } = req.body;
      const article = await Article.create({
        title, slug, content, excerpt, coverImage, tags,
        published: published ?? false,
        author: req.user._id,
      });
      res.status(201).json({ status: "success", data: article });
    } catch (err) { next(err); }
  }
);

export default router;