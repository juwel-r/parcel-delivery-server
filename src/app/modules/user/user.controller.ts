import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { envVars } from "../../config/envConfig";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../utils/jwt/generateToken";

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
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    const decodedToken = verifyToken(
      token,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;
    const result = await UserServices.updateUser(req.body, decodedToken);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Information Updated",
      data: result,
    });
  }
);
export const UserController = {
  createUser,
  getAllUser,
  updateUser,
};
