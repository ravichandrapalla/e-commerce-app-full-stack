// responsible for server startup only

const dotenv = require("dotenv");
dotenv.config();

const app = require("./app").default;

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server is running", PORT);
});
