import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../lib/helpers";
import jwt from "jsonwebtoken";
import { config } from "../lib/config";
import prismaClient from "../lib/prismaClient";

export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) return ErrorResponse(res, 401, "Token not provided");

    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
    };

    if (!decoded) return ErrorResponse(res, 401, "Invalid token");

    const findUser = await prismaClient.user.findUnique({
      where: {
        id: Number(decoded.id),
      },
    });

    if (!findUser) return ErrorResponse(res, 404, "User not found");

    req.userId = findUser.id;
  } catch (error: any) {
    ErrorResponse(res, 500, "Internal server error");
  }
};
