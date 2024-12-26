import express, { Request, Response } from "express";
import { apiRouter } from "./routes";
import { getRedirectUrl } from "./lib/helpers";
import { config } from "./lib/config";

const app = express();
app.use(express.json());

app.use("/api/v1", apiRouter);

app.get("/:shortUrl", async (req: Request, res: Response): Promise<any> => {
  const { shortUrl } = req.params;
  try {
    const destinationUrl = await getRedirectUrl(shortUrl);
    if (!destinationUrl) return res.redirect("https://app.dub.co/suksham");

    return res.redirect(destinationUrl);
  } catch (error) {
    return res.redirect(config.frontendUrl);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
