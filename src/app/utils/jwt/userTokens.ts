import { IUser } from "../../modules/user/user.interface";
import { envVars } from "../../config/envConfig";
import { generateToken } from "./generateToken";

export const createTokens = (userData: Partial<IUser>) => {

  const payload = {
    userId: userData._id,
    email: userData.email,
    role: userData.role,
  };

  const {JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES}= envVars

  const accessToken = generateToken(payload, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES);
  const refreshToken = generateToken(payload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES)

  return {accessToken, refreshToken}
};