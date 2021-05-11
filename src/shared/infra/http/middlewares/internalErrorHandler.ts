import errorCodes from '@config/errorCodes';
import { ErrorRequestHandler } from 'express';
import { IResponseError } from '@shared/infra/http/entities';

const internalErrorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  next,
) => {
  console.error(error);

  const responseError: IResponseError = {
    message: 'Internal server error',
    errorCode: errorCodes.INTERNAL_SERVER_ERROR,
  };

  return response.status(500).json(responseError);
};

export default internalErrorHandler;
