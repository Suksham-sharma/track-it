import { Router, Request, Response } from "express";
import { signInData, signUpData } from "../dtos/auth-dto";
import prismaClient from "../lib/prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../lib/config";
import { ErrorResponse } from "../lib/helpers/response-helpers";

export const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const signinPayload = signInData.safeParse(req.body);

    if (!signinPayload.success) return ErrorResponse(res, 400, "Invalid data");

    const { email, password } = signinPayload.data;

    const findUser = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!findUser) return ErrorResponse(res, 404, "User not found");

    const isAuthenticated = await bcrypt.compare(password, findUser.password);

    if (!isAuthenticated) return ErrorResponse(res, 401, "Invalid credentials");

    const token = jwt.sign(
      { id: findUser.id, email: findUser.email },
      config.jwtSecret
    );

    res.json({
      message: "User logged in successfully",
      token,
    });
  } catch (error: any) {
    ErrorResponse(res, 500, "Internal server error");
  }
});

authRouter.post(
  "/register",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const signupPayload = signUpData.safeParse(req.body);
      if (!signupPayload.success)
        return ErrorResponse(res, 400, "Invalid data");

      const { email, password, username } = signupPayload.data;

      const findUser = await prismaClient.user.findUnique({
        where: {
          email: email,
        },
      });

      if (findUser) return ErrorResponse(res, 409, "Email already exists");

      const hashPassword = await bcrypt.hash(password, 10);
      const user = await prismaClient.user.create({
        data: {
          username,
          email,
          password: hashPassword,
        },
      });

      return res.status(201).json({
        message: "User created successfully",
        data: user,
      });
    } catch (error: any) {
      return ErrorResponse(res, 500, "Internal server error");
    }
  }
);
