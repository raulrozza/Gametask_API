import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { GameNotFoundError } from '@utils/Errors';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gameId = req.headers['x-game-id'];

    if (!gameId) throw new GameNotFoundError('Unindentified game');

    req.game = (String(gameId) as unknown) as Types.ObjectId;

    return next();
  } catch (error) {
    if (error instanceof GameNotFoundError)
      return res.status(403).json({ error: 'Unauthorized access.' });
    else return res.status(500).json({ error: 'Unknown error' });
  }
};
