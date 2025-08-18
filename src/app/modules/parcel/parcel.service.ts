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

const senderParcel = async (id: string) => {
  const result = await Parcel.find({ sender: id });
  return result;
};

const receiverParcel = async (id:string) =>{
  const result = await Parcel.find({receiver:id});

  return result
}

const updateParcelStatus = async (parcelId: string, payload: StatusLog) => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new AppError(404, "No parcel found to update status.");
  }

  if (parcel.isBlock) {
    throw new AppError(
      httStatus.BAD_REQUEST,
      "This parcel is blocked, to update status unblock first."
    );
  }

  const validationStatusUpdate: Record<ParcelStatus, ParcelStatus[]> = {
    [ParcelStatus.REQUESTED]: [ParcelStatus.APPROVED, ParcelStatus.CANCELLED],
    [ParcelStatus.APPROVED]: [ParcelStatus.DISPATCHED, ParcelStatus.CANCELLED],
    [ParcelStatus.DISPATCHED]: [ParcelStatus.IN_TRANSIT],
    [ParcelStatus.IN_TRANSIT]: [ParcelStatus.DELIVERED],
    [ParcelStatus.CANCELLED]: [],
    [ParcelStatus.DELIVERED]: [],
  };

  if (parcel.currentStatus === ParcelStatus.CANCELLED ||
      parcel.currentStatus === ParcelStatus.DELIVERED
  ) {
    throw new AppError(httStatus.BAD_REQUEST,`Parcel current status is ${parcel.currentStatus}, so  unable to update status.`)
  }

  if (!validationStatusUpdate[parcel.currentStatus].includes(payload.status)) {
    throw new AppError(
      httStatus.BAD_REQUEST,
      `'Parcel current status is ${
        parcel.currentStatus
      }, so you can update into '${
        validationStatusUpdate[parcel.currentStatus]
      }'`
    );
  }

  const result = await Parcel.findByIdAndUpdate(
    parcelId,
    { $set: { currentStatus: payload.status }, $push: { statusLog: payload } },
    { new: true, runValidators: true }
  );

  return result;
};

const cancelParcel = async (parcelId: string, payload: StatusLog) => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new AppError(404, "No parcel found to update status.");
  }

  if (!parcel.sender.equals(payload.updatedBy)) {
    throw new AppError(
      httStatus.UNAUTHORIZED,
      "You are not owner of this parcel."
    );
  }

  if (parcel.isBlock) {
    throw new AppError(
      httStatus.BAD_REQUEST,
      "This parcel is blocked, you can't update it's status."
    );
  }

  if (payload.status !== ParcelStatus.CANCELLED) {
    throw new AppError(
      httStatus.BAD_REQUEST,
      "You can only CANCEL your parcel from here"
    );
  }

  if (
    parcel.currentStatus !== ParcelStatus.REQUESTED &&
    parcel.currentStatus !== ParcelStatus.APPROVED
  ) {
    throw new AppError(
      httStatus.BAD_REQUEST,
      "You can cancel a parcel only before DISPATCHED."
    );
  }

  const result = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      $set: { currentStatus: payload.status },
      $push: { statusLog: payload },
    },
    { new: true, runValidators: true }
  );

  return result;
};

const deliveredParcel = async (parcelId: string, payload: StatusLog) => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new AppError(404, "No parcel found to update status.");
  }

  if (!parcel.receiver.equals(payload.updatedBy)) {
    throw new AppError(
      httStatus.UNAUTHORIZED,
      "You are not receiver of this parcel."
    );
  }

  if (parcel.isBlock) {
    throw new AppError(
      httStatus.BAD_REQUEST,
      "This parcel is blocked, you can't update it's status."
    );
  }

  if (payload.status !== ParcelStatus.DELIVERED) {
    throw new AppError(
      httStatus.BAD_REQUEST,
      "You can only update status as DELIVERED"
    );
  }

  if (parcel.currentStatus !== ParcelStatus.IN_TRANSIT) {
    throw new AppError(
      httStatus.BAD_REQUEST,
      "You can update status as DELIVERED only after IN_TRANSIT"
    );
  }

  const result = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      $set: { currentStatus: payload.status },
      $push: { statusLog: payload },
    },
    { new: true, runValidators: true }
  );

  return result;
};

export const ParcelService = {
  createParcel,
  allParcel,
  senderParcel,
  receiverParcel,
  updateParcelStatus,
  cancelParcel,
  deliveredParcel,
};
