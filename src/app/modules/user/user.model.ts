import { model, Schema } from "mongoose";
import { AuthProvider, IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<AuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique:true },
    password: {type: String,minLength: [6, "Password must be at least 6 character."],},
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.SENDER },
    isActive: {type: String,enum: Object.values(IsActive),default: IsActive.ACTIVE,},
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    authProvider: [authProviderSchema],
  },
  { versionKey: false, timestamps: true }
);

export const User = model<IUser>("User", userSchema);
