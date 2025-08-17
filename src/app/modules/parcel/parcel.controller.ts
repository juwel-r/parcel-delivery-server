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


const myParcel = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {

    const {id} = req.params
    const result = await ParcelService.myParcel(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All of your parcels retrieved successfully",
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


export const ParcelController = {
    createParcel,
    allParcel,
    myParcel,
    updateParcelStatus
}