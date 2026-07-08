import { Response } from "express";

interface ISendResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const sendResponse = <T>(res: Response, data: ISendResponse<T>) => {
  res.status(data.statusCode).json({
    success: true,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
