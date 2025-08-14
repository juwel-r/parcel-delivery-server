import { User } from "./user.model";
import { IUser } from "./user.interface";

const createUser = async (user:Partial<IUser>) => {
    console.log(user);
    const result = await User.create(user);
    return result;
};

export const UserServices = {
  createUser,
};
