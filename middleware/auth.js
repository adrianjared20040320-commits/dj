import jwt from "jsonwebtoken";
import User from "../models/User.js";

// GENERA TOKEN
export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: "HS256",
  });
};

// ENVIA TOKEN
export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };

  res.cookie("jwt", token, cookieOptions);

  // Remover password
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};

// VERIFICA TOKEN
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    } else if (
      req.headers.authorization?.startsWith("Token ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "No autorizado. Inicia sesión." });
    }

    // Verifica token (expiró o inválido)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Existe usuario?
    const currentUser = await User.findById(decoded.id).select(
      "+loginAttempts +lockUntil"
    );

    if (!currentUser) {
      return res.status(401).json({ error: "El usuario ya no existe." });
    }

    // Verifica que la contraseña no haya cambiado
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        error: "Contraseña cambiada recientemente. Inicia sesión de nuevo.",
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido." });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado. Inicia sesión de nuevo." });
    }
    next(err);
  }
};

// AUTORIZACIÓN ROL
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "No tienes permiso para realizar esta acción.",
      });
    }
    next();
  };
};

// LIMPIAR COOKIE
export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ status: "success" });
};
