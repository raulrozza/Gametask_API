import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import envs from '@config/environment';
import errorCodes from '@config/errorCodes';

import { RequestError } from '@shared/errors/implementations';

interface IAuth {
  id: string;
}

const verifyAuthentication: RequestHandler = async (request, _, next) => {
  const header = request.headers.authorization;

  if (!header)
    throw new RequestError(
      'Authentication is need to access this resource',
      errorCodes.INVALID_TOKEN,
      403,
    );

  try {
    const [, token] = header.split(' ');

    const auth = await jwt.verify(token, String(envs.SECRET_KEY));

    request.auth = auth as IAuth;

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError)
      throw new RequestError(
        'Invalid authentication token',
        errorCodes.INVALID_TOKEN,
        401,
      );
    else
      throw new RequestError(
        'Internal server error!',
        errorCodes.INTERNAL_SERVER_ERROR,
        500,
      );
  }
};

export default verifyAuthentication;
