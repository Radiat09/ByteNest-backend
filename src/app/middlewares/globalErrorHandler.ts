import { Request, Response, NextFunction } from "express";

const globalErrorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errorSources = err.errorSources || [{ path: "", message: err.message }];

  // Zod validation error
  if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation Error";
    errorSources = err.issues?.map((issue: any) => ({
      path: issue.path.join("."),
      message: issue.message,
    })) || [];
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
    errorSources = [{ path: err.path, message: `${err.value} is not a valid ID` }];
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const match = err.message.match(/index: (.+?)_1/);
    const fieldName = match ? match[1] : "field";
    message = "Duplicate Entry";
    errorSources = [{ path: "", message: `${fieldName} already exists` }];
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errorSources = Object.values(err.errors).map((e: any) => ({
      path: e.path,
      message: e.message,
    }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
