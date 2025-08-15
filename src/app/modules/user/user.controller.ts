import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createUser(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: result,
    });
  }
);

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUser();

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "All user retrieved successfully",
      data: result,
    });
  }
);

export const UserController = {
  createUser,
  getAllUser,
};
