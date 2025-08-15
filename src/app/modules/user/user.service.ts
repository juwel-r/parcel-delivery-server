import { User } from "./user.model";
import { IUser } from "./user.interface";

const createUser = async (user:Partial<IUser>) => {
    const result = await User.create(user);
    return result;
};

const getAllUser = async ()=>{
  const result = await User.find({}).select("-password")
  return result 
}

export const UserServices = {
  createUser,
  getAllUser
};
