import Game from 'models/Game';
import ActivityRegister from 'models/ActivityRegister';
import handleRemoveActivityRegister from 'actions/handleRemoveActivityRegister';
import { MissingParametersError, errorCodes } from 'utils/Errors';
import { Request, Response } from 'express';
import { isValidObjectId, Types } from 'mongoose';

// This controller manages the activities in the application, creating and updating their data
export default {
  // This method lists all activity registers
  async index(req: Request, res: Response) {
    try {
      const activities = await ActivityRegister.find({ game: req.game })
        .populate('activity')
        .populate({
          path: 'requester',
          populate: {
            path: 'user',
          },
        })
        .sort({ requestDate: -1 });

      return res.json(activities);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  async delete(req: Request, res: Response) {
    const { id } = req.params as { id?: Types.ObjectId };
    const game = req.game;

    try {
      if (!id || !isValidObjectId(id))
        throw new MissingParametersError('Missing activity id on parameters.');

      await handleRemoveActivityRegister(id, game);
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // The store methods creates a new activity
  async store(req: Request, res: Response) {
    const {
      requester,
      activity,
      requestDate,
      completionDate,
      information,
    } = req.body;

    const game = req.game;

    try {
      // Create register
      const activityRegister = await ActivityRegister.create({
        requester,
        activity,
        requestDate,
        completionDate,
        information,
        game,
      }).catch(error => {
        throw error;
      });

      // Update registers on Game
      await Game.updateOne(
        { _id: game },
        {
          $inc: {
            newRegisters: 1,
          },
        },
      );

      return res.json(activityRegister);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
