/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { User } from "./user.model";
import { AuthProvider, IsActive, IUser, Role } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/envConfig";
import { QueryBuilder } from "../../utils/queryBuilder";
import { searchableFields } from "./user.constant";
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

const getAllUser = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);

  const result = await queryBuilder
    .filter()
    .search(searchableFields)
    .fields()
    .sort()
    .paginate()
    .build();

    

  const meta = await queryBuilder.getMeta();
  if (!result) {
    throw new AppError(404, "User not found.");
  }
  return { result, meta };

};

const getReceivers = async () => {
  const result = await User.find({ role: Role.RECEIVER }).select("_id name");
  return result;
};

const getMe = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await User.findById(id).select("-password");
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>,
  updater: JwtPayload
) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(404, "No user found to update.");
  }

  if (
    (user!.isActive === IsActive.BLOCK && !payload.isActive) ||
    user!.isDeleted
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked or deleted.");
  }

  if (payload.role) {
    if (updater.role !== Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not permitted to update Role"
      );
    }
  }
  if (updater.userId === id) {
    throw new AppError(httpStatus.FORBIDDEN, "You can't update your own role.");
  }

  if (
    (payload.isActive || payload.isDeleted || payload.isVerified) &&
    updater.role !== Role.ADMIN
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
  console.log(payload);

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

const deleteUser = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(404, "User not found to be delete.");
  }

  await User.findByIdAndUpdate(id, { $set: { isDeleted: true } });

  return user;
};

export const UserServices = {
  createUser,
  getAllUser,
  getReceivers,
  getMe,
  getSingleUser,
  updateUser,
  swapRole,
  deleteUser,
};
