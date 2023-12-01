import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { RequestError } from '@/protocols';

export type AppError = Error & {
  name: string;
};

export default function errorHandlingMiddleware(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  // Errors declarations
  if (error.name === 'notFoundError') {
    return res.status(httpStatus.NOT_FOUND).send(error.message);
  }

  if (error.name === 'invalidParamError') {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.message);
  }

  if (error.name === 'conflictError') {
    return res.status(httpStatus.CONFLICT).send(error.message);
  }

  if (error.name === 'InvalidDataError' || error.name === 'InvalidCEPError') {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: error.message,
    });
  }

  if (error.name === 'DuplicatedEmailError') {
    return res.status(httpStatus.CONFLICT).send({
      message: error.message,
    });
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: error.message,
    });
  }
  if (error.name === 'InvalidCredentialsError') {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: error.message,
    });
  }

  if (error.hasOwnProperty('status') && error.name === 'RequestError') {
    return res.status((error as RequestError).status).send({
      message: error.message,
    });
  }

  console.log(error);
  return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
}
