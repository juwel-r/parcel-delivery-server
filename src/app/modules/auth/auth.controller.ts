import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    

     return
});
const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     return
});
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     return
});
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     return
});

export const AuthController ={
    credentialLogin,
    refreshToken,
    logout,
    resetPassword
}