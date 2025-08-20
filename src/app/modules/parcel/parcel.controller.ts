import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ParcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const result = await ParcelService.createParcel(req);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel created successfully",
      data: result,
    });
  }
);

const getAllParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const query = req.query;
    

    const result = await ParcelService.getAllParcel(query as Record<string,string>);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All parcels retrieved successfully",
      data: result,
    });
  }
);

const getSingleParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const {id} = req.params

    const result = await ParcelService.getSingleParcel(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All parcels retrieved successfully",
      data: result,
    });
  }
);

const senderAllParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { id } = req.params;
    const result = await ParcelService.senderAllParcel(id, req.query as Record<string,string>);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All of your parcels retrieved successfully",
      data: result,
    });
  }
);

const receiverAllParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { id } = req.params;
    const result = await ParcelService.receiverAllParcel(id, req.query as Record<string,string>);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All of receiver parcels retrieved successfully",
      data: result,
    });
  }
);

const receiverDeliveredParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { id } = req.params;
    const result = await ParcelService.receiverDeliveredParcel(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All of receiver parcels retrieved successfully",
      data: result,
    });
  }
);

const receiverUpcomingParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { id } = req.params;
    const result = await ParcelService.receiverUpcomingParcel(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All of receiver parcels retrieved successfully",
      data: result,
    });
  }
);

const updateParcelStatus = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { id } = req.params;

    const result = await ParcelService.updateParcelStatus(id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel status updated successfully",
      data: result,
    });
  }
);

const cancelParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { id } = req.params;

    const result = await ParcelService.cancelParcel(id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel has been CANCELLED",
      data: result,
    });
  }
);

const deliverParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { id } = req.params;

    const result = await ParcelService.deliverParcel(id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel has been DELIVERED",
      data: result,
    });
  }
);

const deliveryHistory = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { trackingId } = req.params;

    const result = await ParcelService.deliveryHistory(trackingId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel history showing",
      data: result,
    });
  }
);

const blockParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { id } = req.params;

    const result = await ParcelService.blockParcel(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: `Parcel has been ${result?.isBlock ?"Blocked":"Unblocked"}`,
      data: null,
    });
  }
);

export const ParcelController = {
  createParcel,
  getAllParcel,
  senderAllParcel,
  receiverAllParcel,
  receiverDeliveredParcel,
  receiverUpcomingParcel,
  updateParcelStatus,
  cancelParcel,
  deliverParcel,
  deliveryHistory,
  blockParcel,
  getSingleParcel,
};
