import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: string;
}

const loadEnvVar = (): EnvConfig => {
  const requiredVars: (keyof EnvConfig)[] = ["PORT", "DB_URL", "NODE_ENV"];

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
  };
};

export const envVars = loadEnvVar();
