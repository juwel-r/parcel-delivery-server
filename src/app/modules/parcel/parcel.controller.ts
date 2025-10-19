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
      data: result.data,
      meta:result.meta
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


const myAllParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const verifiedToken = req.user
    const result = await ParcelService.myAllParcel(verifiedToken.userId, req.query as Record<string,string>);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My parcels are retrieved successfully",
      data: result.result,
      meta: result.meta
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

    const result = await ParcelService.receiverDeliveredParcel(req.user.userId);

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
    const verifiedToken = req.user
    const result = await ParcelService.receiverUpcomingParcel(verifiedToken.userId, req.query as Record<string, string>);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All of receiver parcels retrieved successfully",
      data: result.data,
      meta:result.meta
    });
  }
);

const updateParcelStatus = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { id } = req.params;
    const payload=req.body;
    const verifiedToken = req.user
    payload.updatedBy= verifiedToken.userId

    const result = await ParcelService.updateParcelStatus(id, payload);

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
    const result = await ParcelService.cancelParcel(id, req.user.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel has been CANCELLED",
      data: result,
    });
  }
);

const confirmDelivery = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { id } = req.params;

    const result = await ParcelService.confirmDelivery(id, req.user.userId);

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

const getDashboardOverview = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {

    const result = await ParcelService.getDashboardOverview();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Overview generated.",
      data: result,
    });
  }
);



export const ParcelController = {
  createParcel,
  getAllParcel,
  myAllParcel,
  senderAllParcel,
  receiverAllParcel,
  receiverDeliveredParcel,
  receiverUpcomingParcel,
  updateParcelStatus,
  cancelParcel,
  confirmDelivery,
  deliveryHistory,
  blockParcel,
  getSingleParcel,
  getDashboardOverview
};
