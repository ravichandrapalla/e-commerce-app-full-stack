// app config only
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./features/auth/auth.routes";

const app = express();

app.use(helmet());

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.get("/api/v1/auth", authRoutes);

export default app;
