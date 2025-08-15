import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/envConfig";
import { isUserExistOrActive } from "../isUserExistOrActive";
import { generateToken, verifyToken } from "./generateToken";

export  const createAccessTokenByRefreshToken = async (refreshToken: string) => {
  const { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES, JWT_REFRESH_SECRET } = envVars;

  const verifyRefreshToken = verifyToken(
    refreshToken,
    JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await isUserExistOrActive(verifyRefreshToken.email);

  const payload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const newAccessToken = generateToken(
    payload,
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES
  );

  return  newAccessToken;
};
