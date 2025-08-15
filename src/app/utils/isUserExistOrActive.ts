import AppError from "../errorHelpers/AppError";
import { IsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import httpStatus from 'http-status-codes'

export const isUserExistOrActive =async (email:string)=>{
  const isUserExist = await User.findOne({ email: email });

  if (!isUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `No user exist with ${email}`
    );
  }

  if (isUserExist.isActive !== IsActive.ACTIVE || isUserExist.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User Inactive or Blocked or Deleted."
    );
  }

  return isUserExist
}