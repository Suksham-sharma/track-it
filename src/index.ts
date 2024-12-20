import express from "express";
import { apiRouter } from "./routes";

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/v1", apiRouter);
