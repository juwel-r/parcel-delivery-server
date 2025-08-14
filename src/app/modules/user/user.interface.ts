export enum Role {
  ADMIN = "ADMIN",
  RECEIVER = "RECEIVER",
  SENDER = "SENDER",
}

export interface AuthProvider {
  provider: "google" | "credential";
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCK = "BLOCK",
}

export interface IUser {
  name: string;
  email: string;
  password?:string;
  phone?: string;
  address?: string;
  role: Role;
  isActive: IsActive;
  isVerified: boolean;
  isDeleted: boolean;
  authProvider: AuthProvider;
}
