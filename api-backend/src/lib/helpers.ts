import { Response } from "express";
import axios from "axios";

export function ErrorResponse(res: Response, status: number, message: string) {
  return res.status(status).json({
    message: message,
  });
}

export async function generateUniqueId() {
  try {
    const response = await axios.get("http://localhosy:4001/");
    if (response.status === 200) {
      return response.data.id;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
