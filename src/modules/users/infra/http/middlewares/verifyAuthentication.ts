import { RequestHandler } from 'express';

import errorCodes from '@config/errorCodes';

import { RequestError } from '@shared/errors/implementations';
import JwtTokenProvider from '@modules/users/providers/TokenProvider/implementations/JwtTokenProvider';

interface IAuth {
  id: string;
}

const verifyAuthentication: RequestHandler = async (request, _, next) => {
  const header = request.headers.authorization;

  if (!header)
    throw new RequestError(
      'Authentication is needed to access this resource',
      errorCodes.INVALID_TOKEN,
      403,
    );

  const [, token] = header.split(' ');

  const tokenProvider = new JwtTokenProvider();

  const auth = await tokenProvider.verify<IAuth>(token);

  if (!auth)
    throw new RequestError(
      'Invalid authentication token',
      errorCodes.INVALID_TOKEN,
      401,
    );

  request.auth = auth;

  return next();
};

export default verifyAuthentication;
