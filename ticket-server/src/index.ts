import { serve } from "@hono/node-server";
import { Hono } from "hono";
import urlRangeManager from "./lib/utils";

const app = new Hono();

app.get("/", async (c) => {
  const newID = await urlRangeManager.fetchId();

  console.log("already fetched");
  if (!newID) {
    return c.json({
      message: "Error fetching ID",
    });
  }

  return c.json({
    message: "ID fetched successfully",
    id: newID,
  });
});

const port = 4001;
console.log(`Server is running on http://localhost:${port}`);

// async function main(i: number) {
//   asyncLock.acquire();
//   console.log("before " + i);
//   await new Promise((r) => setTimeout(r, 1000));

//   console.log("after " + i);
//   asyncLock.release();
// }

// function main2() {
//   for (let i = 0; i < 5; i++) {
//     main(i);
//   }
// }

// main2();

serve({
  fetch: app.fetch,
  port,
});
