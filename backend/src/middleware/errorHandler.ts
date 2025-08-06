import { Request, Response, NextFunction } from "express";

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(", ");
    error = new AppError(message, 400);
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    const message = `${field} давхцаж байна`;
    error = new AppError(message, 400);
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    const message = "Буруу ID формат";
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Буруу токен";
    error = new AppError(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Токен хүчингүй болсон";
    error = new AppError(message, 401);
  }

  // Default error
  const statusCode = (error as AppError).statusCode || 500;
  const message = error.message || "Серверийн алдаа";

  // Development environment-д дэлгэрэнгүй алдааны мэдээлэл
  const errorResponse: any = {
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  };

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`API endpoint олдсонгүй: ${req.originalUrl}`, 404);
  next(error);
};
