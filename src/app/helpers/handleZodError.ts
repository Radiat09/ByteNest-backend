import { ZodError } from "zod";
import { IGenericErrorResponse, TErrorSources } from "../interfaces/error.types";

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errorSources: TErrorSources[] = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

export default handleZodError;
