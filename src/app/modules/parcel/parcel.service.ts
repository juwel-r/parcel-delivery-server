import { Request } from "express";
import { trackingId } from "../../utils/trackingId";
import { IParcel, ParcelStatus, StatusLog } from "./parcel.interface";
import { calculateParcelFee } from "../../utils/calculateParcelFee";
import { Parcel } from "./parcel.model";
import { IUser, Role } from "../user/user.interface";
import AppError from "../../errorHelpers/AppError";
import httStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";

const createParcel = async (req: Request) => {
  const payload: Partial<IParcel> = req.body;
  const user = req.user;

  if (user.role === Role.RECEIVER) {
    throw new AppError(
      httStatus.UNAUTHORIZED,
      "Your are a RECEIVER, You are not permitted to send a parcel. Be a SENDER to send parcel"
    );
  }

  const statusLog: StatusLog = {
    status: ParcelStatus.REQUESTED,
    location: payload.pickupAddress as string,
    updatedBy: user.userId,
  };

  payload.trackingId = trackingId();
  payload.sender = user.userId;
  payload.fee = calculateParcelFee(Number(payload.weight));
  payload.statusLog = [statusLog];

  const parcel = await Parcel.create(payload);

  return parcel;
};

const allParcel = async () => {
  const result = await Parcel.find({});

  return result;
};

const myParcel = async (id: string) => {
  const result = await Parcel.find({ sender: id });
  return result;
};

const updateParcelStatus = async (id: string, payload: StatusLog) => {
  const parcel = await Parcel.findById(id);
  const updater = await User.findById(payload.updatedBy);

  if (!updater) {
    throw new AppError(404, "No updater found.");
  }

  if (!parcel) {
    throw new AppError(404, "No parcel found to update status.");
  }

  if (parcel.isBlock) {
    throw new AppError(
      httStatus.BAD_REQUEST,
      "This parcel is blocked, to update status unblock first."
    );
  }

  const errMessage = (updateable:string) => {
    return `'Parcel current status is ${parcel.currentStatus}, so you can update into ${updateable}`;
  };

  //STATUS UPDATE ->
  if (updater.role === Role.ADMIN) {

    if (parcel.currentStatus === ParcelStatus.REQUESTED &&payload.status !== ParcelStatus.APPROVED) 
      {throw new AppError(httStatus.BAD_REQUEST,errMessage("APPROVED"))}

    if (parcel.currentStatus === ParcelStatus.APPROVED &&payload.status !== ParcelStatus.DISPATCHED) 
      {throw new AppError(httStatus.BAD_REQUEST,errMessage("DISPATCHED"))}

    if (parcel.currentStatus === ParcelStatus.DISPATCHED &&payload.status !== ParcelStatus.IN_TRANSIT) 
      {throw new AppError(httStatus.BAD_REQUEST,errMessage("IN_TRANSIT"))}

    if (parcel.currentStatus === ParcelStatus.IN_TRANSIT &&payload.status !== ParcelStatus.DELIVERED) 
      {throw new AppError(httStatus.BAD_REQUEST,errMessage("DELIVERED"))}

    const result = await Parcel.findByIdAndUpdate(id,
      {$set: { currentStatus: payload.status },$push: { statusLog: payload }},
      { new: true, runValidators: true }
    );

    return result;
  }

  //CANCEL ->
  if (payload.status === ParcelStatus.CANCELLED) {
    if ((updater as IUser).role !== Role.ADMIN && !parcel.sender.equals(updater._id)) {
      throw new AppError(httStatus.UNAUTHORIZED,"You are not allowed not CANCEL this parcel.");
    }

    const result = await Parcel.findByIdAndUpdate(id,
      { $set: { currentStatus: payload.status }, $push: { statusLog: payload }},
      { new: true, runValidators: true }
    );

    return result;
  } 
  else{
    throw new AppError(httStatus.BAD_REQUEST,"You are not ADMIN or not owner of this parcel." )
  }
};

export const ParcelService = {
  createParcel,
  allParcel,
  myParcel,
  updateParcelStatus,
};
