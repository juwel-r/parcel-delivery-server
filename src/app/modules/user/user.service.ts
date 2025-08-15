import { User } from "./user.model";
import { AuthProvider, IUser } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/envConfig";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "Email already registered!");
  }

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
    rest,
    authProvider
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

const updateUser = async ()=>{
  return
}

export const UserServices = {
  createUser,
  getAllUser,
  updateUser
};
