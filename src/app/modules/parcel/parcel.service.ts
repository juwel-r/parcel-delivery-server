import { Request } from "express";
import { trackingId } from "../../utils/trackingId";
import { IParcel, ParcelStatus, StatusLog } from "./parcel.interface";
import { calculateParcelFee } from "../../utils/calculateParcelFee";
import { Parcel } from "./parcel.model";
import { Role } from "../user/user.interface";
import AppError from "../../errorHelpers/AppError";
import httStatus from "http-status-codes";
import { User } from "../user/user.model";
import { searchableFields } from "./parcel.constant";
import { QueryBuilder } from "../../utils/queryBuilder";

const createParcel = async (req: Request) => {
  const payload: Partial<IParcel> = req.body;
  const user = await User.findById(req.user.userId);

  if (!user) {
    throw new AppError(404, "Sender is not exist.");
  }

  if (!user.phone || !user.address) {
    throw new AppError(
      httStatus.FORBIDDEN,
      "Please update phone number and address to create parcel"
    );
  }

  if (user.role === Role.RECEIVER) {
    throw new AppError(
      httStatus.UNAUTHORIZED,
      "Your are a RECEIVER, please swap your role to SENDER to create parcel."
    );
  }

  const isReceiverExist = await User.findById(payload.receiver);

  if (!isReceiverExist) {
    throw new AppError(404, "Receiver is not exist.");
  }

  if (isReceiverExist.role !== Role.RECEIVER) {
    throw new AppError(
      400,
      `Parcel Receiver's current role is ${isReceiverExist.role}, please contact with him to swap his role.`
    );
  }

  const statusLog: StatusLog = {
    status: ParcelStatus.REQUESTED,
    location: payload.pickupAddress as string,
    updatedBy: req.user.userId,
  };

  payload.trackingId = trackingId();
  payload.sender = req.user.userId;
  payload.fee = calculateParcelFee(Number(payload.weight));
  payload.statusLog = [statusLog];

  const parcel = await Parcel.create(payload);

  return parcel;
};

const getAllParcel = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Parcel.find(), query);

  const result = await queryBuilder
    .filter()
    .search(searchableFields)
    .fields()
    .sort()
    .build();

  return result;
};

const getSingleParcel = async (id: string) => {
  const result = await Parcel.findById(id);

  return result;
};

const myAllParcel = async (id: string, query:Record<string, string>) => {
  const isSenderExist = await User.findById(id);

  if (!isSenderExist) {
    throw new AppError(httStatus.NOT_FOUND, "Parcel sender is not exist.");
  }
  const queryBuilder = new QueryBuilder(Parcel.find({sender:id}), query);

  const result = await queryBuilder
    .filter()
    .search(searchableFields)
    .fields()
    .sort()
    .build();

  return result;
};

const senderAllParcel = async (id: string, query:Record<string, string>) => {
  const isSenderExist = await User.findById(id);

  if (!isSenderExist) {
    throw new AppError(httStatus.NOT_FOUND, "Parcel sender is not exist.");
  }
  const queryBuilder = new QueryBuilder(Parcel.find(), query);

  const result = await queryBuilder
    .filter()
    .search(searchableFields)
    .fields()
    .sort()
    .build();

  return result;
};

const receiverAllParcel = async (id: string, query:Record<string, string>) => {
  const isReceiverExist = await User.findById(id);

  if (!isReceiverExist) {
    throw new AppError(httStatus.NOT_FOUND, "Receiver is not exist.");
  }
  const queryBuilder = new QueryBuilder(Parcel.find(), query);

  const result = await queryBuilder
    .filter()
    .search(searchableFields)
    .fields()
    .sort()
    .build();

  return result;
};

const receiverDeliveredParcel = async (id: string) => {
  const isReceiverExist = await User.findById(id);

  if (!isReceiverExist) {
    throw new AppError(httStatus.NOT_FOUND, "Receiver is not exist.");
  }

  const result = await Parcel.find({
    receiver: id,
    currentStatus: { $eq: ParcelStatus.DELIVERED },
  });

  return result;
};

const receiverUpcomingParcel = async (id: string) => {
  const isReceiverExist = await User.findById(id);

  if (!isReceiverExist) {
    throw new AppError(httStatus.NOT_FOUND, "Receiver is not exist.");
  }

  const result = await Parcel.find({
    receiver: id,
    currentStatus: { $nin: [ParcelStatus.DELIVERED, ParcelStatus.CANCELLED] },
  });

  return result;
};

const deliveryHistory = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId })
    .select(
      "-weight -isBlock -createdAt -updatedAt -fee -details -pickupAddress"
    )
    .populate("sender", "name phone")
    .populate("receiver", "name phone");

  if (!parcel) {
    throw new AppError(404, "Parcel not found with your tracking id.");
  }

  return parcel;
};

const updateParcelStatus = async (parcelId: string, payload: StatusLog) => {
  const parcel = await Parcel.findById(parcelId);

  const updater = await User.findById(payload.updatedBy);

  if (!updater) {
    throw new AppError(404, "Updater is not exist.");
  }

  if (!parcel) {
    throw new AppError(404, "No parcel found to update status.");
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

  const validationStatusUpdate: Record<ParcelStatus, ParcelStatus[]> = {
    [ParcelStatus.REQUESTED]: [ParcelStatus.APPROVED, ParcelStatus.CANCELLED],
    [ParcelStatus.APPROVED]: [ParcelStatus.DISPATCHED, ParcelStatus.CANCELLED],
    [ParcelStatus.DISPATCHED]: [ParcelStatus.IN_TRANSIT],
    [ParcelStatus.IN_TRANSIT]: [ParcelStatus.DELIVERED],
    [ParcelStatus.CANCELLED]: [],
    [ParcelStatus.DELIVERED]: [],
  };

  if (
    parcel.currentStatus === ParcelStatus.CANCELLED ||
    parcel.currentStatus === ParcelStatus.DELIVERED
  ) {
    throw new AppError(
      httStatus.BAD_REQUEST,
      `Parcel current status is ${parcel.currentStatus}, so  unable to update status.`
    );
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

const deliverParcel = async (parcelId: string, payload: StatusLog) => {
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

const blockParcel = async (parcelId: string) => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new AppError(404, "No parcel found to block.");
  }

  const result = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      $set: { isBlock: !parcel.isBlock },
    },
    { new: true }
  );

  return result;
};

export const ParcelService = {
  createParcel,
  getAllParcel,
  myAllParcel,
  senderAllParcel,
  receiverAllParcel,
  receiverDeliveredParcel,
  updateParcelStatus,
  cancelParcel,
  deliverParcel,
  deliveryHistory,
  blockParcel,
  getSingleParcel,
  receiverUpcomingParcel,
};
