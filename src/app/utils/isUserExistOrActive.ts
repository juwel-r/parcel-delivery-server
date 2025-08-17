import AppError from "../errorHelpers/AppError";
import { IsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";

export const isUserExistOrActive = async (email: string, id?: string) => {
  const isUserExist = await User.findOne({ email: email });

  if (id) {
    const isUserExistWithId = await User.findById(id);
    if (!isUserExistWithId) {
      throw new AppError(httpStatus.BAD_REQUEST, `No user found with id`);
    }
  }

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, `No user exist with ${email}`);
  }

  if (isUserExist.isActive !== IsActive.ACTIVE || isUserExist.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User Inactive or Blocked or Deleted."
    );
  }

  return isUserExist;
};
