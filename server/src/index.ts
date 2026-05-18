// responsible for server startup only

// responsible for server startup only

import "dotenv/config";
import app from "./app";

export default app;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("server is running", PORT);
  });
}
