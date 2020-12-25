import {
  MissingParametersError,
  PlayerExistsError,
  errorCodes,
} from 'utils/Errors';
import Game from 'models/Game';
import Player from 'models/Player';
import { Request, Response } from 'express';

export default {
  async show(req: Request, res: Response) {
    const { gameId, inviter } = req.params;
    const { id } = req.auth;

    try {
      if (!gameId || !inviter)
        throw new MissingParametersError('Missing parameters');

      // Checks if the user is already registered in this game
      const player = await Player.findOne({ game: gameId, user: id });

      if (player) throw new PlayerExistsError('Player already exists');

      const game = await Game.findOne(
        {
          _id: gameId,
          administrators: inviter,
        },
        {
          image: 1,
          image_url: 1,
          name: 1,
          description: 1,
          theme: 1,
        },
      );

      return res.json(game);
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      if (error instanceof PlayerExistsError)
        return res.status(400).json({
          error: error.message,
          code: errorCodes.PLAYER_ALREADY_EXISTS,
        });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
