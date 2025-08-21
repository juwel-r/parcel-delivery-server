import { model, Schema } from "mongoose";
import { IParcel, ParcelStatus, StatusLog } from "./parcel.interface";

const statusLogSchema = new Schema<StatusLog>(
  {
    status: { type: String, enum: Object.values(ParcelStatus), required: true },
    location: { type: String, required: true },
    notes: { type: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false, _id:false }
);

const parcelSchema = new Schema<IParcel>({
  trackingId: { type: String, unique:true, required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pickupAddress: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  type: { type: String, required: true },
  details:{ type: String},
  weight: { type: Number, default: 0 },
  fee: { type: Number, required: true },
  deliveryDate: { type: String, required: true },
  currentStatus: {type: String,enum: Object.values(ParcelStatus),default: ParcelStatus.REQUESTED},
  statusLog: [statusLogSchema],
  isBlock: { type: Boolean, default: false },
},
{
versionKey:false,
timestamps:true
});

export const Parcel = model<IParcel>("Parcel", parcelSchema);
