import { Router, Request, Response } from "express";
import { linkData } from "../dtos/link-dto";
import { ErrorResponse, generateUniqueId } from "../lib/helpers";

export const linkRouter = Router();

linkRouter.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const linkPayload = linkData.safeParse(req.body);
    if (!linkPayload.success) return ErrorResponse(res, 400, "Invalid payload");

    const uniqueId = await generateUniqueId();

    if (!uniqueId) return ErrorResponse(res, 500, "Internal server error");
  } catch (error: unknown) {
    ErrorResponse(res, 500, "Internal server error");
  }
});
