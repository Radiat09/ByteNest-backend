import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import config from "./app/config/env";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import routes from "./app/routes";

const app = express();

app.use(
  cors({
    origin:
      config.nodeEnv === "production"
        ? [config.frontendUrl]
        : [config.frontendUrl, "http://localhost:3000"],
    credentials: true,
  }),
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
  },
});

const limiterMiddleware =
  config.nodeEnv === "production" ? apiLimiter : (req: any, res: any, next: any) => next();
const authLimiterMiddleware =
  config.nodeEnv === "production" ? authLimiter : (req: any, res: any, next: any) => next();

app.use("/auth/login", authLimiterMiddleware);
app.use("/auth/jwt", authLimiterMiddleware);

app.use(cookieParser());

app.post(
  "/webhooks",
  express.raw({ type: "application/json" }),
  (req: Request & { rawBody?: Buffer }, _res, next) => {
    req.rawBody = req.body;
    next();
  },
);

app.post(
  "/orders/webhooks",
  express.raw({ type: "application/json" }),
  (req: Request & { rawBody?: Buffer }, _res, next) => {
    req.rawBody = req.body;
    next();
  },
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running");
});

app.use("/", limiterMiddleware, routes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
