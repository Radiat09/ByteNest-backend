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
    origin: [config.frontendUrl, "http://localhost:3000"],
    credentials: true,
  }),
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts, please try again later." },
});

app.use("/auth/login", authLimiter);
app.use("/auth/jwt", authLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const rawBodySaver = (req: Request, res: Response, next: any) => {
  const chunks: Buffer[] = [];
  req.on("data", (chunk: Buffer) => chunks.push(chunk));
  req.on("end", () => {
    try {
      req.rawBody = Buffer.concat(chunks);
      req.body = JSON.parse(req.rawBody.toString());
      next();
    } catch (err) {
      res.status(400).send("Invalid JSON");
    }
  });
  req.on("error", () => {
    res.status(400).send("Request error");
  });
};

app.use("/orders/webhooks", rawBodySaver);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running");
});

app.use("/", apiLimiter, routes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
