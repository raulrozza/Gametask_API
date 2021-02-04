import errorCodes from '@config/errorCodes';
import { RequestHandler } from 'express';
import { IResponseError } from '@shared/infra/http/entities';

const notFoundErrorHandler: RequestHandler = (_, response) => {
  const errorResponse: IResponseError = {
    message: 'This resource does not exist',
    errorCode: errorCodes.RESOURCE_NOT_FOUND,
  };

  return response.status(404).json(errorResponse);
};

export default notFoundErrorHandler;
