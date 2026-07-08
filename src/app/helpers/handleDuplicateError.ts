import { IGenericErrorResponse } from "../interfaces/error.types";

const handleDuplicateError = (error: any): IGenericErrorResponse => {
  const statusCode = 400;
  const match = error.message.match(/index: (.+?)_1/);
  const fieldName = match ? match[1] : "field";

  return {
    statusCode,
    message: "Duplicate Entry",
    errorSources: [
      {
        path: "",
        message: `${fieldName} already exists`,
      },
    ],
  };
};

export default handleDuplicateError;
