import mongoose from "mongoose";
import { IGenericErrorResponse } from "../interfaces/error.types";

const handleCastError = (error: mongoose.Error.CastError): IGenericErrorResponse => {
  const statusCode = 400;
  return {
    statusCode,
    message: "Invalid ID",
    errorSources: [
      {
        path: error.path,
        message: `${error.value} is not a valid ID`,
      },
    ],
  };
};

export default handleCastError;
