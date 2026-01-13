import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "supersecret",
  JWT_ACCESS_SECRET:process.env.JWT_ACCESS_SECRET||"accsecret",
  JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET||"refsecret",
  NODE_ENV: process.env.NODE_ENV || "development"
};
