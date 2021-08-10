import errorCodes from '@config/errorCodes';
import { RequestHandler } from 'express';
import { IErrorResponse } from '@shared/domain/errors';

const notFoundErrorHandler: RequestHandler = (_, response) => {
  const errorResponse: IErrorResponse = {
    message: 'This resource does not exist',
    errorCode: errorCodes.RESOURCE_NOT_FOUND,
  };

  return response.status(404).json(errorResponse);
};

export default notFoundErrorHandler;
