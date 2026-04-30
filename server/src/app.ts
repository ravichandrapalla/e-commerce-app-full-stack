// app config only
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

app.use(helmet());

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.get("/api/v1/health", (req, res) => {
  res.json({ message: "Server is running" });
});

module.exports = app;
