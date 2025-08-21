import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name at-least 2 character" })
    .max(20, { message: "Name can't exceed 20 character" }),
  email: z.email({ message: "Email is not valid" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 character" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter." })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter." })
    .regex(/\d/, { message: "Must include a digit." })
    .regex(/[!@#$%^&*()_+{}\\[\]:;"'<>,.?/~\\|-]/, {
      message: "Must include a special character.",
    })
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Please provide valid phone number",
    })
    .optional(),
  address: z
    .string({ message: "Address must be string" })
    .max(200, { message: "Address can not exceed 200 character." })
    .optional(),
  role:z.enum([Role.RECEIVER,Role.SENDER])
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name at-least 2 character" })
    .max(20, { message: "Name can't exceed 20 character" })
    .optional(),

  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 character" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter." })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter." })
    .regex(/\d/, { message: "Must include a digit." })
    .regex(/[!@#$%^&*()_+{}\\[\]:;"'<>,.?/~\\|-]/, {
      message: "Must include a special character.",
    })
    .optional(),

  oldPassword: z.string().optional(),

  phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Please provide a valid phone number",
    })
    .optional(),

  address: z
    .string({ message: "Address must be string" })
    .max(200, { message: "Address can not exceed 200 character." })
    .optional(),

  role: z.enum(Object.values(Role)).optional(),
  isActive:z.enum(Object.values(IsActive)).optional(),
  isVerified: z.boolean().optional(),
});
