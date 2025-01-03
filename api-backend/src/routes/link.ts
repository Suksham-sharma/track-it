import { Router, Request, Response } from "express";
import { linkData } from "../dtos/link-dto";
import prismaClient from "../lib/prismaClient";
import transcoder from "../lib/managers/transcoding";
import { dynamoDBService } from "../lib/managers/awsManager";
import { config } from "../lib/config";
import { ErrorResponse } from "../lib/helpers/response-helpers";
import { generateUniqueId } from "../lib/helpers/utils";

export const linkRouter = Router();

linkRouter.post("/", async (req: Request, res: Response): Promise<any> => {
  const { userId } = req;
  try {
    const linkPayload = linkData.safeParse(req.body);
    if (!linkPayload.success) return ErrorResponse(res, 400, "Invalid payload");

    const { url, description } = linkPayload.data;

    const uniqueId = await generateUniqueId();

    if (!uniqueId) throw new Error("Failed to generate unique id");

    const shortUrl = transcoder.encodeUrlIdToHash(uniqueId);

    if (!shortUrl) throw new Error("Failed to create short link");

    const createdLink = await prismaClient.userLink.create({
      data: {
        id: uniqueId,
        destinationUrl: url,
        shortLink: shortUrl,
        userId: userId!,
        description,
      },
    });

    if (!createdLink)
      throw new Error("Failed to create link, please try again");

    await dynamoDBService.putItem({
      shortCode: shortUrl,
      destinationUrl: createdLink.destinationUrl,
    });

    res.send({
      message: "Link created successfully",
      shortUrl: config.baseUrl + shortUrl,
    });
  } catch (error: unknown) {
    ErrorResponse(res, 500, "Internal server error");
  }
});
