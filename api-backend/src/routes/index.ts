import Router from "express";
import { authRouter } from "./auth";
import { linkRouter } from "./link";
import { protectedRoute } from "../middleware/protectedRoute";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/link", protectedRoute, linkRouter);
