import { envVars } from "../config/envConfig";
import AppError from "../errorHelpers/AppError";
import {
  AuthProvider,
  IsActive,
  IUser,
  Role,
} from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const { ADMIN_EMAIL, ADMIN_PASS, BCRYPT_SALT_ROUND } = envVars;
    const isAdminExist = await User.findOne({ email: ADMIN_EMAIL });

    if (isAdminExist) {
      console.log("Admin added is this server.");
      return;
    }

    const hashedPass = await bcryptjs.hash(
      ADMIN_PASS,
      Number(BCRYPT_SALT_ROUND)
    );

    const authProvider: AuthProvider = {
      provider: "credential",
      providerId: ADMIN_EMAIL,
    };

    const adminPayload: Partial<IUser> = {
      name: "System Admin",
      email: ADMIN_EMAIL,
      role: Role.ADMIN,
      phone: "01712345678",
      address: "System admin, no address",
      password: hashedPass,
      authProvider: authProvider,
      isActive: IsActive.ACTIVE,
      isVerified: true,
      isDeleted: false,
    };
    const admin = await User.create(adminPayload);
    const data = admin.toObject();
    delete data.password;
    console.log(data);
  } catch (error: any) {
    console.log(error);
    throw new AppError(400, error.message);
  }
};
