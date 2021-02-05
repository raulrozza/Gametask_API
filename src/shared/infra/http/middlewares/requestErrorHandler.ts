import { RequestError } from '@shared/errors/implementations';
import { ErrorRequestHandler } from 'express';

const requestErrorHandler: ErrorRequestHandler = (error, _, response, next) => {
  if (error instanceof RequestError) {
    return response.status(error.statusCode).json(error.toJsonResponse());
  }

  return next();
};

export default requestErrorHandler;
