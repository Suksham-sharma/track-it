import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "",
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:30001",
};
