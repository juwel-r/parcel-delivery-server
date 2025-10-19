import { Types } from "mongoose";

export enum ParcelStatus {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  DISPATCHED = "DISPATCHED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export interface StatusLog {
  status: ParcelStatus;
  location?: string;
  notes?: string;
  updatedBy: Types.ObjectId;
  timestamp?: Date;
}

export interface IParcel {
  trackingId: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  pickupAddress: string;
  deliveryAddress: string;
  type: string;
  details:string;
  weight?: number;
  fee: number;
  deliveryDate:string;
  currentStatus: ParcelStatus;
  statusLog: StatusLog[];
  isBlock: boolean;
}


