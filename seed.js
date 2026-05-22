import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB conectado");

    // Verificar que no exista ya un admin
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) {
      console.log("Ya existe un usuario con ese correo. Seed omitido.");
      process.exit(0);
    }

    await User.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD_SEED,
      role: "admin",
    });

    console.log(`Admin creado: ${process.env.ADMIN_EMAIL}`);
    console.log("Elimina ADMIN_PASSWORD_SEED de tu .env en producción");
  } catch (err) {
    console.error("Error en seed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
