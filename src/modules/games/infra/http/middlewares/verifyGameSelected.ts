import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/errors/implementations';
import { RequestHandler } from 'express';

const verifyGameSelected: RequestHandler = async (request, _, next) => {
  const gameId = request.headers['x-game-id'];

  if (!gameId)
    throw new RequestError(
      'You need to select a game to access this resource',
      errorCodes.INVALID_TOKEN,
      403,
    );

  request.game = String(gameId);

  return next();
};

export default verifyGameSelected;
