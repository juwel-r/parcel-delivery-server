/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { User } from "./user.model";
import { IUser } from "./user.interface";
import { createTokens } from "../../utils/jwt/userTokens";
import { setTokenToCookie } from "../../utils/jwt/setTokenToCookie";
import { JwtPayload } from "jsonwebtoken";

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

    const result = await UserServices.getAllUser( req.query as Record<string, string>);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All user retrieved successfully",
      data: result,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const verifiedToken = req.user;
    console.log({verifiedToken});
    const id = verifiedToken.userId
    const result = await UserServices.getMe(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All user retrieved successfully",
      data: result,
    });
  }
);

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await UserServices.getSingleUser(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All user retrieved successfully",
      data: result,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await UserServices.updateUser(id, req.body, req.user as JwtPayload);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Information Updated",
      data: result,
    });
  }
);

const swapRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(id);

    const result = await UserServices.swapRole(user as IUser);
    user!.role = result!.role;

    const userToken = createTokens(user as IUser);
    setTokenToCookie(res, userToken);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: result?.message as string,
      data: null,
    });
  }
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await UserServices.deleteUser(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `${result?.name} has been deleted.`,
      data: null,
    });
  }
);

export const UserController = {
  createUser,
  getAllUser,
  getMe,
  getSingleUser,
  updateUser,
  swapRole,
  deleteUser
};
