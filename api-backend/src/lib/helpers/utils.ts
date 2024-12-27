import axios from "axios";
import { dynamoDBService } from "../managers/awsManager";
import { getClientAnalytics } from "./userinfo-helper";
import kafkaManager from "../managers/kafkaManager";

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

export async function publishClientMetaData(req: any) {
  const clientData = await getClientAnalytics(req);
  // await kafkaManager.produceEvents("client-info", clientData);
  console.log("Client Data", clientData);
}
