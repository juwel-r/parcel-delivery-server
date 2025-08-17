import z from "zod";
import { ParcelStatus } from "./parcel.interface";

export const parcelZodSchema = z.object({
  receiver:z.string(),
  pickupAddress: z.string(),
  deliveryAddress: z.string(),
  type: z.string(),
  details: z.string().optional(),
  weight: z.number().optional(),
  currentStatus: z.enum(Object.values(ParcelStatus)),
});

export const updateStatusLog = z.object({
  status: z.enum(Object.values(ParcelStatus)),
  location: z.string(),
  notes: z.string().optional(),
  updateBy:z.string(),
  timestamp: z.date().optional(),
});