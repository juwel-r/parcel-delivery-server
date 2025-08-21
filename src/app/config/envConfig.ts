import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: string;
  ADMIN_EMAIL: string;
  ADMIN_PASS: string;
  BCRYPT_SALT_ROUND: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  DB_URL_LIVE:string;
}

const loadEnvVar = (): EnvConfig => {
  const requiredVars: (keyof EnvConfig)[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "ADMIN_EMAIL",
    "ADMIN_PASS",
    "BCRYPT_SALT_ROUND",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "DB_URL_LIVE",
  ];

  requiredVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`${key} environment variable is not assigned in`);
    }
  });

  const envString = (key: keyof EnvConfig): any => {
    return process.env[key];
  };

  return {
    PORT: envString("PORT"),
    DB_URL: envString("DB_URL"),
    NODE_ENV: envString("NODE_ENV"),
    ADMIN_EMAIL: envString("ADMIN_EMAIL"),
    ADMIN_PASS: envString("ADMIN_PASS"),
    BCRYPT_SALT_ROUND: envString("BCRYPT_SALT_ROUND"),
    JWT_ACCESS_SECRET: envString("JWT_ACCESS_SECRET"),
    JWT_ACCESS_EXPIRES: envString("JWT_ACCESS_EXPIRES"),
    JWT_REFRESH_SECRET: envString("JWT_REFRESH_SECRET"),
    JWT_REFRESH_EXPIRES: envString("JWT_REFRESH_EXPIRES"),
    DB_URL_LIVE:envString("DB_URL_LIVE")
  };
};

export const envVars = loadEnvVar();
