import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DOMPurify from "dompurify";
import axios from "../lib/axios.js";

// VALIDACIÓN (Zod)
const eventSchema = z.object({
  name: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),

  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Teléfono inválido"),

  email: z
    .string()
    .email("Correo inválido")
    .max(100, "Correo demasiado largo"),

  eventDate: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      return date > new Date();
    }, "La fecha debe ser futura"),

  eventType: z.enum(["interior", "exterior"], {
    errorMap: () => ({ message: "Selecciona interior o exterior" }),
  }),

  hours: z
    .number({ invalid_type_error: "Ingresa un número" })
    .int("Solo números enteros")
    .min(5, "Mínimo 5 horas")
    .max(24, "Máximo 24 horas"),

  guestCount: z
    .number({ invalid_type_error: "Ingresa un número" })
    .int("Solo números enteros")
    .min(10, "Mínimo 10 personas"),

  address: z
    .string()
    .min(10, "Ingresa una dirección completa")
    .max(300, "Dirección demasiado larga"),

  package: z.enum(["dj", "premium", "cotizar"], {
    errorMap: () => ({ message: "Selecciona un paquete" }),
  }),
});

// SANITIZAR
const sanitizeString = (value) => {
  if (typeof value !== "string") return value;
  return DOMPurify.sanitize(value.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

const sanitizeFormData = (data) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, sanitizeString(value)])
  );
};

// HOOK
export const useEventForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); 

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      eventDate: "",
      eventType: "interior",
      hours: 5,
      guestCount: 10,
      address: "",
      package: "dj",
    },
  });

  const onSubmit = async (rawData) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // Sanitizar antes de enviar
      const sanitizedData = sanitizeFormData(rawData);

      const { data } = await axios.post("/api/events", sanitizedData);

      setSubmitResult({
        success: true,
        message: data.message,
        totalPrice: data.data.totalPrice,
      });

      form.reset();
    } catch (err) {
      const serverErrors = err.response?.data?.errors;

      if (serverErrors) {
        Object.entries(serverErrors).forEach(([field, message]) => {
          form.setError(field, { type: "server", message });
        });
      }

      setSubmitResult({
        success: false,
        message:
          err.response?.data?.error ||
          "Error al enviar. Intenta de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    submitResult,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
