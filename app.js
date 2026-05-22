import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Rutas
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import eventRoutes from "./routes/events.js";
import productRoutes from "./routes/products.js";
import blogRoutes from "./routes/blog.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();

// CONEXIÓN A MONGODB
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => {
    console.error("❌ Error MongoDB:", err.message);
    process.exit(1);
  });

// HEADERS (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://www.googletagmanager.com",
          "https://connect.facebook.net",
          "https://sdk.mercadopago.com",
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: [
          "'self'",
          "https://www.google-analytics.com",
          "https://api.mercadopago.com",
        ],
        frameSrc: ["https://www.mercadopago.com", "https://www.google.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    noSniff: true,
    xssFilter: true,
  })
);

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requests sin origin
      if (!origin && process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS bloqueado para: ${origin}`));
      }
    },
    credentials: true, // Cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["X-RateLimit-Remaining"],
    maxAge: 86400,
  })
);

// RATE LIMIT
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,                  // 100 requests por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas peticiones, intenta de nuevo en 15 minutos.",
  },
  skip: (req) => req.path === "/health",
});

// Rate limit para login
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Demasiados intentos de login. Espera 15 minutos.",
  },
  skipSuccessfulRequests: true,
});

// Rate limit para formularios públicos
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20,
  message: {
    error: "Límite de envío de formularios alcanzado. Intenta en 1 hora.",
  },
});

app.use(generalLimiter);

// PARSEO Y SANITIZACIÓN DE BODY
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Elimina $ y . para prevenir inyecciones NoSQL
app.use(mongoSanitize());

app.use(hpp({
  whitelist: ["sort", "fields", "page", "limit"],
}));

// LOGGING
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  // Errores y advertencias
  app.use(morgan("combined", {
    skip: (req, res) => res.statusCode < 400,
  }));
}

// RUTAS
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/contact", formLimiter, contactRoutes);
app.use("/api/events", formLimiter, eventRoutes);
app.use("/api/products", productRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/admin", adminRoutes);

// RUTAS NO ENCONTRADAS
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

// MANEJO GLOBAL ERRORES
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV === "development";

  // Error de CORS
  if (err.message && err.message.startsWith("CORS bloqueado")) {
    return res.status(403).json({ error: err.message });
  }

  console.error(`[ERROR] ${err.status || 500} — ${err.message}`);

  res.status(err.status || 500).json({
    error: isDev ? err.message : "Error interno del servidor.",
    ...(isDev && { stack: err.stack }),
  });
});

// INICIO DEL SERVIDOR
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Modo: ${process.env.NODE_ENV}`);
});

export default app;
