import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/envConfig";

export const globalError = (err: any, req: Request, res: Response, next: NextFunction) => {
  res
    .status(500)
    .json({
      message: `Something went wrong ${err.message}`,
      err,
      stack: envVars.NODE_ENV === "development" ? err.stack : null,
    });
}