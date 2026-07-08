import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running");
});

app.use("/", routes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
