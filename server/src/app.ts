// app config only
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./features/auth/auth.routes";
import productRoutes from "./features/product/product.routes";
import cartRoutes from "./features/cart/cart.routes";
import orderRoutes from "./features/order/order.routes";
import adminRoutes from "./features/admin/admin.route";
import sellerRoutes from "./features/seller/seller.route";
import categoryRoutes from "./features/category/category.routes";
import paymentRoutes from "./features/payment/payment.routes";
import heroRoutes from "./features/hero/hero.routes";
import { errorHandler } from "./middlewares/error.middleware";
import rateLimit from "express-rate-limit";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

const clientOrigins = (process.env.CLIENT_URL ?? "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: clientOrigins.length > 0 ? clientOrigins : true,
    credentials: true,
  }),
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});
app.use(limiter);

app.use(morgan("dev"));

app.use("/api/v1/payments", paymentRoutes);

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/seller", sellerRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/hero-slides", heroRoutes);

app.use(errorHandler);

export default app;
