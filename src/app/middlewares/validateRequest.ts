import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import AppError from "../errorHelpers/AppError";

const validateRequest = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      if (error.errors) {
        const messages = error.errors.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ");
        next(new AppError(messages, 400));
      } else {
        next(new AppError("Validation failed", 400));
      }
    }
  };
};

export default validateRequest;
