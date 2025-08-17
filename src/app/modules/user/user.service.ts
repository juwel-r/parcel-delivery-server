/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { User } from "./user.model";
import { AuthProvider, IsActive, IUser, Role } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/envConfig";

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

const updateUser = async (id: string, payload: Partial<IUser>) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(404, "No user found to update.");
  }

  if (user!.isActive === IsActive.BLOCK || user!.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are blocked or deleted user."
    );
  }

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (payload.role) {
    if (user.role === Role.RECEIVER || user.role === Role.SENDER) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not permitted to update Role"
      );
    }
  }

  if (
    (payload.isActive || payload.isDeleted || payload.isVerified) &&
    user.role !== Role.ADMIN
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

  const updateUser = await User.findByIdAndUpdate(user!._id, payload, {
    new: true,
    runValidators: true,
  });

  return updateUser;
};

const swapRole = async (user: IUser) => {
  if (user.role === Role.RECEIVER) {
    await User.findByIdAndUpdate(user._id, {
      $set: { role: Role.SENDER },
    });
    return {
      role: Role.SENDER,
      message: "You are now a SENDER.",
    };
  } else if (user.role === Role.SENDER) {
    await User.findByIdAndUpdate(user._id, {
      $set: { role: Role.RECEIVER },
    });
    return {
      role: Role.RECEIVER,
      message: "You are now a RECEIVER.",
    };
  }
};

export const UserServices = {
  createUser,
  getAllUser,
  updateUser,
  swapRole,
};
