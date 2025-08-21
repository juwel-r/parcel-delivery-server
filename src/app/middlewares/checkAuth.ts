import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import { NextFunction, Request, Response } from "express";
import { isUserExistOrActive } from "../utils/isUserExistOrActive";
import { envVars } from "../config/envConfig";
import { verifyToken } from "../utils/jwt/generateToken";

export const checkAuth =  (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const accessToken = req.headers.authorization;
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new AppError(403, "No access token received");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      await isUserExistOrActive(verifiedToken.email, verifiedToken.userId);

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          403,
          "You are not authorized person for this route."
        );
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };