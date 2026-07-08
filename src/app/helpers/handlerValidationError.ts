import mongoose from "mongoose";
import { IGenericErrorResponse } from "../interfaces/error.types";

const handleValidationError = (error: mongoose.Error.ValidationError): IGenericErrorResponse => {
  const statusCode = 400;
  const errorSources = Object.values(error.errors).map((err) => ({
    path: err.path,
    message: err.message,
  }));

  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

export default handleValidationError;
