/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Response } from "express";
import AppError from "../../errorHelpers/AppError";
import { isUserExistOrActive } from "../../utils/isUserExistOrActive";
import { createAccessTokenByRefreshToken } from "../../utils/jwt/accessTokenByRefreshToken";
import { createTokens } from "../../utils/jwt/userTokens";
import { IUser } from "../user/user.interface";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { envVars } from "../../config/envConfig";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await isUserExistOrActive(email as string);

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password not match.");
  }

  const userTokens = createTokens(isUserExist);

  return userTokens;
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createAccessTokenByRefreshToken(refreshToken);
  return { accessToken: newAccessToken };
};

const userLogout = async (res:Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
};

const resetPassword = async (oldPassword:string, newPassword:string, userId:string)=>{
  const user = await User.findById(userId);
  const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user?.password as string);

  if (!isOldPasswordMatch) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Old Password does not matched!"
    );
  }

  const newHashPass = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

  user!.password = newHashPass
  user!.save()


}

export const AuthService = {
  credentialLogin,
  getNewAccessToken,
  userLogout,
  resetPassword
};
