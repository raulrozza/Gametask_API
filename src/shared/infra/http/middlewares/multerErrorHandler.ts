import errorCodes from '@config/errorCodes';
import { IErrorResponse } from '@shared/domain/errors';
import { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';

const multerErrorHandler: ErrorRequestHandler = (error, _, response, next) => {
  if (error instanceof MulterError) {
    const responseJson: IErrorResponse = {
      errorCode: errorCodes.BAD_REQUEST_ERROR,
      message: error.message,
    };

    return response.status(400).json(responseJson);
  }

  return next();
};

export default multerErrorHandler;
