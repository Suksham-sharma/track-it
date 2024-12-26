import { Response } from "express";
import axios from "axios";
import { dynamoDBService } from "./managers/awsManager";

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

export async function getRedirectUrl(shortUrl: string): Promise<string> {
  try {
    const response = await dynamoDBService.getItem(shortUrl);
    if (!response) throw new Error("No destination found");
    return response;
  } catch (error) {
    return "https://app.dub.co/suksham";
  }
}
