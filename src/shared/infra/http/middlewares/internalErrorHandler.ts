import errorCodes from '@config/errorCodes';
import { IErrorResponse } from '@shared/domain/errors';
import { ErrorRequestHandler } from 'express';

const internalErrorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  next,
) => {
  console.error(error);

  const responseError: IErrorResponse = {
    message: 'Internal server error',
    errorCode: errorCodes.INTERNAL_SERVER_ERROR,
  };

  return response.status(500).json(responseError);
};

export default internalErrorHandler;
