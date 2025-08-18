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


const allParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {

    const result = await ParcelService.allParcel();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All parcels retrieved successfully",
      data: result,
    });
  }
);

const senderParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {

    const {id} = req.params
    const result = await ParcelService.senderParcel(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All of your parcels retrieved successfully",
      data: result,
    });
  }
);

const receiverParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {

    const {id} = req.params
    const result = await ParcelService.receiverParcel(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All of receiver parcels retrieved successfully",
      data: result,
    });
  }
);


const updateParcelStatus = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const {id} = req.params;

    const result = await ParcelService.updateParcelStatus(id, req.body)

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
    const {id} = req.params;

    const result = await ParcelService.cancelParcel(id, req.body)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel has been CANCELLED",
      data: result,
    });
  }
);

const deliveredParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const {id} = req.params;

    const result = await ParcelService.deliveredParcel(id, req.body)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel has been DELIVERED",
      data: result,
    });
  }
);




export const ParcelController = {
    createParcel,
    allParcel,
    senderParcel,
    receiverParcel,
    updateParcelStatus,
    cancelParcel,
    deliveredParcel
}