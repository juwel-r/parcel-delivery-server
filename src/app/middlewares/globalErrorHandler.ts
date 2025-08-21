import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/envConfig";
import AppError from "../errorHelpers/AppError";
import { handleZodError } from "../errorHelpers/zodError";
import { handleCastError, handleDuplicateError, handleValidationError } from "../errorHelpers/mongooseError";

export const globalError = (error: any, req: Request, res: Response, next: NextFunction) => {
if(envVars.NODE_ENV === "development" ? error.stack : null){
    console.log(error);
  }

  let statusCode = 500;
  let message = error.message;

  if (error.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.StatusCode;
    message = simplifiedError.message;
  } 
  else if (error.name === "CastError") {
    const simplifiedError = handleCastError();
    statusCode = simplifiedError.StatusCode;
    message = simplifiedError.message;
  } 
  else if (error.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.StatusCode;
    message = simplifiedError.message;
  }
  else if (error.name === "ZodError") {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode:statusCode,
    message: message,
    error:envVars.NODE_ENV === "development" ? error : null,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};
