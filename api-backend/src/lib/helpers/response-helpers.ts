import { Response } from "express";

export function ErrorResponse(res: Response, status: number, message: string) {
  res.status(status).json({
    message: message,
  });
  return;
}
