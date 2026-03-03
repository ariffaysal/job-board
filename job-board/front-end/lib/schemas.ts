import { z } from "zod";

// Registration schema
export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"], "Role must be admin or user"),
});

// Type for form state
export type RegisterForm = z.infer<typeof registerSchema>;

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Type for login state
export type LoginForm = z.infer<typeof loginSchema>;
            