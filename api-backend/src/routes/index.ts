import Router from "express";
import { authRouter } from "./auth";
import { linkRouter } from "./link";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/link", linkRouter);
