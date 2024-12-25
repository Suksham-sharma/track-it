import { Response } from "express";
import axios from "axios";

export function ErrorResponse(res: Response, status: number, message: string) {
  res.status(status).json({
    message: message,
  });
  return;
}

export async function generateUniqueId() {
  try {
    const response = await axios.get("http://localhost:4001/");
    if (response.status === 200) {
      return response.data.id;
    }

    return false;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return false;
  }
}
