import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const refreshToken = async (
  refreshToken: string,
  cb: () => Response<any, Record<string, any>>
) => {
  try {
    const verifiedToken: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECREATE_TOKEN as string
    );
    const userId = verifiedToken._id as string;
    return userId;
  } catch (err: any) {
    cb();
  }
};
export const TokenMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("X-token");
  const refresh = req.header("X-refresh-token");
  if (!token) return res.status(401).send("ACCESS DENIED");

  try {
    const verifiedToken: any = jwt.verify(
      token,
      process.env.SECREATE_TOKEN as string
    );
    req.UserId = verifiedToken._id as string;

    next();
  } catch (error) {
    const id = (await refreshToken(refresh, () =>
      res.status(400).send("Invalid Token")
    )) as string;
    // create and assign an authentification token
    const token = jwt.sign({ _id: id }, process.env.SECREATE_TOKEN as string, {
      expiresIn: "1h",
      issuer: "Rada Chat",
    });
    req.UserId = id;
    req.token = token;
    next();
  }
};

const errorTypes = {
  ValidationError: 422,
  UniqueViolationError: 409,
};

const errorMessages = {
  UniqueViolationError: "Already exists.",
};

export function notFound(
  req: { originalUrl: any },
  res: { status: (arg0: number) => void },
  next: (arg0: Error) => void
) {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(
  error: { name: string | number; message: any; stack: any; errors: any },
  _req: any,
  res: {
    statusCode: number;
    status: (arg0: any) => void;
    json: (arg0: {
      status: any;
      message: any;
      stack: any;
      errors: any;
    }) => void;
  },
  _next: any
) {
  const statusCode =
    res.statusCode === 200
      ? errorTypes.UniqueViolationError || 500
      : res.statusCode;
  res.status(statusCode);
  res.json({
    status: statusCode,
    message: errorMessages.UniqueViolationError || error.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
    errors: error.errors || undefined,
  });
}
