import { User } from "./user.model";
import { AuthProvider, IUser, Role } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/envConfig";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  //no need to check isUserExist, email set as unique:true

  const authProvider: AuthProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const hashPass = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const userData = {
    email,
    password: hashPass,
    ...rest,
    authProvider,
  };

  const user = await User.create(userData);

  const result = user.toObject();
  delete result.password;

  return result;
};

const getAllUser = async () => {
  const result = await User.find({}).select("-password");
  return result;
};

const updateUser = async (
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  if (payload.role) {
    if (
      decodedToken.role === Role.RECEIVER ||
      decodedToken.role === Role.SENDER
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not permitted to update Role"
      );
    }
  }

  if (
    (payload.isActive || payload.isDeleted || payload.isVerified) &&
    decodedToken.role !== Role.ADMIN
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not permitted to update."
    );
  }

  if (payload.password) {
    throw new AppError(
      httpStatus.METHOD_NOT_ALLOWED,
      "Update information except password."
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const updateUser = await User.findByIdAndUpdate(user!._id, payload, {
    new: true,
    runValidators: true,
  });

  return updateUser;
};

export const UserServices = {
  createUser,
  getAllUser,
  updateUser,
};
