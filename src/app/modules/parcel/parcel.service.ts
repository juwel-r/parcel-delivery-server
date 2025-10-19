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
import { Types } from "mongoose";

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

  const result = queryBuilder
    .filter()
    .search(searchableFields)
    .fields()
    .sort()
    .populate("receiver sender", "_id name")
    .paginate();

  const [data, meta] = await Promise.all([
    result.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleParcel = async (id: string) => {
  const result = await Parcel.findById(id);

  return result;
};

const myAllParcel = async (id: string, query: Record<string, string>) => {
  const isSenderExist = await User.findById(id);

  if (!isSenderExist) {
    throw new AppError(httStatus.NOT_FOUND, "Parcel sender is not exist.");
  }
  const queryBuilder = new QueryBuilder(Parcel.find({ sender: id }), query);

  const result = await queryBuilder
    .filter()
    .search(searchableFields)
    .fields()
    .sort()
    .populate("receiver", "_id name")
    .paginate()
    .build();

  const meta = await queryBuilder.getMeta();

  return { result, meta };
};

const senderAllParcel = async (id: string, query: Record<string, string>) => {
  const isSenderExist = await User.findById(id);

  if (!isSenderExist) {
    throw new AppError(httStatus.NOT_FOUND, "Parcel sender is not exist.");
  }
  query.sender = id;
  const queryBuilder = new QueryBuilder(Parcel.find(), query);

  const result = await queryBuilder
    .filter()
    .search(searchableFields)
    .populate("receiver sender", "_id name")
    .fields()
    .sort()
    .build();

  return result;
};

const receiverAllParcel = async (id: string, query: Record<string, string>) => {
  const isReceiverExist = await User.findById(id);

  if (!isReceiverExist) {
    throw new AppError(httStatus.NOT_FOUND, "Receiver is not exist.");
  }
  query.sender = id;
  const queryBuilder = new QueryBuilder(Parcel.find(), query);

  const result = await queryBuilder
    .filter()
    .search(searchableFields)
    .fields()
    .sort()
    .populate("sender", "_id name")
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
  }).populate("sender", "name");

  return result;
};

const receiverUpcomingParcel = async (
  id: string,
  query: Record<string, string>
) => {
  const isReceiverExist = await User.findById(id);

  if (!isReceiverExist) {
    throw new AppError(httStatus.NOT_FOUND, "Receiver is not exist.");
  }
  query.receiver = id;
  const queryBuilder = new QueryBuilder(Parcel.find(), query);

  const data = await queryBuilder
    .filter()
    .search(searchableFields)
    .fields()
    .sort()
    .populate("receiver sender", "_id name")
    .paginate()
    .build();

  const meta = await queryBuilder.getMeta();

  return { data, meta };
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

const cancelParcel = async (parcelId: string, updatedBy: Types.ObjectId) => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new AppError(404, "No parcel found to update status.");
  }

  if (!parcel.sender.equals(updatedBy)) {
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

  // if (payload.status !== ParcelStatus.CANCELLED) {
  //   throw new AppError(
  //     httStatus.BAD_REQUEST,
  //     `You are not permitted to ${payload.status}`
  //   );
  // }

  if (
    parcel.currentStatus !== ParcelStatus.REQUESTED &&
    parcel.currentStatus !== ParcelStatus.APPROVED
  ) {
    throw new AppError(
      httStatus.BAD_REQUEST,
      "You can cancel a parcel only before DISPATCHED."
    );
  }

  const payload = {
    status: ParcelStatus.CANCELLED,
    location: "",
    updatedBy,
  };

  const result = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      $set: { currentStatus: ParcelStatus.CANCELLED },
      $push: { statusLog: payload },
    },
    { new: true, runValidators: true }
  );

  return result;
};

const confirmDelivery = async (parcelId: string, updatedBy: Types.ObjectId) => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new AppError(404, "No parcel found to update status.");
  }

  if (!parcel.receiver.equals(updatedBy)) {
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

  if (parcel.currentStatus !== ParcelStatus.IN_TRANSIT) {
    throw new AppError(
      httStatus.BAD_REQUEST,
      "You can update status as DELIVERED only after IN_TRANSIT"
    );
  }

  const payload = {
    status: ParcelStatus.CANCELLED,
    location: "",
    updatedBy,
  };
  const result = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      $set: { currentStatus: ParcelStatus.DELIVERED },
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

const getDashboardOverview = async () => {
  // Overview counts
  const [overview] = await Parcel.aggregate([
    {
      $group: {
        _id: null,
        totalParcels: { $sum: 1 },
        delivered: {
          $sum: { $cond: [{ $eq: ["$currentStatus", "DELIVERED"] }, 1, 0] },
        },
        inTransit: {
          $sum: { $cond: [{ $eq: ["$currentStatus", "IN_TRANSIT"] }, 1, 0] },
        },
        pendingOrCancelled: {
          $sum: {
            $cond: [
              {
                $in: [
                  "$currentStatus",
                  ["REQUESTED", "APPROVED", "DISPATCHED", "CANCELLED"],
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const monthlyShipments = await Parcel.aggregate([
    {
      $addFields: {
        createdAtDate: { $toDate: "$createdAt" },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAtDate" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        count: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);

  const statusDistribution = await Parcel.aggregate([
    {
      $group: {
        _id: "$currentStatus",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
      },
    },
  ]);

  return {
    cards: overview || {
      totalParcels: 0,
      delivered: 0,
      inTransit: 0,
      pendingOrCancelled: 0,
    },
    charts: {
      monthlyShipments,
      statusDistribution,
    },
  };
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
  confirmDelivery,
  deliveryHistory,
  blockParcel,
  getSingleParcel,
  receiverUpcomingParcel,
  getDashboardOverview,
};
