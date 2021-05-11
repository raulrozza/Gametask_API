import errorCodes from '@config/errorCodes';
import { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';
import { IResponseError } from '../entities';

const multerErrorHandler: ErrorRequestHandler = (error, _, response, next) => {
  if (error instanceof MulterError) {
    const responseJson: IResponseError = {
      errorCode: errorCodes.BAD_REQUEST_ERROR,
      message: error.message,
    };

    return response.status(400).json(responseJson);
  }

  return next();
};

export default multerErrorHandler;
