import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { setTokenToCookie } from "../../utils/jwt/setTokenToCookie";
import AppError from "../../errorHelpers/AppError";
import { verifyToken } from "../../utils/jwt/generateToken";
import { envVars } from "../../config/envConfig";
import { JwtPayload } from "jsonwebtoken";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tokens = await AuthService.credentialLogin(req.body);
    setTokenToCookie(res, tokens);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Login successful.",
      data: tokens,
    });
  }
);

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "No refresh token found. Please login."
      );
    }

    const newAccessToken = await AuthService.getNewAccessToken(refreshToken);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User tokens generated.",
      data: newAccessToken,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await AuthService.userLogout(res);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Logged out.",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const { newPassword, oldPassword } = req.body;

    await AuthService.resetPassword(
      oldPassword,
      newPassword,
      req.user.userId as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password changed successfully.",
      data: null,
    });
  }
);

export const AuthController = {
  credentialLogin,
  refreshToken,
  logout,
  resetPassword,
};
