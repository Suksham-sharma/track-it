import { Response } from "express";

export function ErrorResponse(res: Response, status: number, message: string) {
  return res.status(status).json({
    message: message,
  });
}
