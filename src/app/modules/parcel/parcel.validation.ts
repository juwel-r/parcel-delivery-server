import z from "zod";
import { ParcelStatus } from "./parcel.interface";

export const parcelZodSchema = z.object({
  receiver:z.string(),
  weight: z.number().positive({error:"Weight must be positive number."}).optional(),
  type: z.string(),
  pickupAddress: z.string(),
  deliveryAddress: z.string(),
  deliveryDate:z.string(),
  details: z.string().optional(),
});

export const updateStatusLog = z.object({
  status: z.enum(Object.values(ParcelStatus)),
  location: z.string(),
  notes: z.string().optional(),
});