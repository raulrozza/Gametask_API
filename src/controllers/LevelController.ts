import Game from '@models/Game';
import { MissingParametersError, errorCodes } from '@utils/Errors';
import checkPlayersLevels from '@actions/checkPlayersLevel';
import { Request, Response } from 'express';
import { isValidObjectId, Types } from 'mongoose';

/* 
  This controller manages the game level info configuration
*/
export default {
  async update(req: Request<{ id?: Types.ObjectId }>, res: Response) {
    const { levelInfo } = req.body;
    const { id } = req.params;
    const { id: userId } = req.auth;

    try {
      if (!id || !isValidObjectId(id))
        throw new MissingParametersError('Missing game id on parameters.');

      await Game.updateOne(
        {
          _id: id,
          administrators: userId,
        },
        {
          $set: { levelInfo },
        },
      ).catch(error => {
        throw error;
      });

      checkPlayersLevels(id);

      return res.status(201).send();
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
