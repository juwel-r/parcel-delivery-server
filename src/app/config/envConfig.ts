import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: string;
  ADMIN_EMAIL: string;
  ADMIN_PASS: string;
  BCRYPT_SALT_ROUND:string;
}

const loadEnvVar = (): EnvConfig => {
  const requiredVars: (keyof EnvConfig)[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "ADMIN_EMAIL",
    "ADMIN_PASS",
    "BCRYPT_SALT_ROUND"
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
    ADMIN_EMAIL:envString("ADMIN_EMAIL"),
    ADMIN_PASS:envString("ADMIN_PASS"),
    BCRYPT_SALT_ROUND:envString("BCRYPT_SALT_ROUND")
  };
};

export const envVars = loadEnvVar();
