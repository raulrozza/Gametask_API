import Game from 'models/Game';
import AchievementRegister from 'models/AchievementRegister';
import {
  MissingParametersError,
  errorCodes,
  AchievementRegisterExistsError,
} from 'utils/Errors';
import { Request, Response } from 'express';

// This controller manages the activities in the application, creating and updating their data
export default {
  // This method lists all activity registers
  async index(req: Request, res: Response) {
    try {
      const achievementRegisters = await AchievementRegister.find({
        game: req.game,
      })
        .populate({
          path: 'achievement',
          populate: {
            path: 'title',
          },
        })
        .populate({
          path: 'requester',
          populate: {
            path: 'user',
          },
        })
        .sort({ requestDate: -1 })
        .catch(error => {
          throw error;
        });

      return res.json(achievementRegisters);
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const game = req.game;

    try {
      if (!id)
        throw new MissingParametersError(
          'Missing achievement id on parameters.',
        );

      await AchievementRegister.deleteOne({ _id: id });

      await Game.updateOne(
        { _id: game },
        {
          $inc: {
            newRegisters: -1,
          },
        },
      );
    } catch (error) {
      console.error(error);

      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // The store methods creates a new activity
  async store(req: Request, res: Response) {
    const { requester, achievement, requestDate, information } = req.body;

    const game = req.game;

    try {
      // Check if register already exists

      const register = await AchievementRegister.findOne({
        requester,
        achievement,
        game,
      });

      if (register)
        throw new AchievementRegisterExistsError(
          'Already requested this achievement.',
        );

      // Create register
      const achievementRegister = await AchievementRegister.create({
        requester,
        achievement,
        requestDate,
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

      return res.json(achievementRegister);
    } catch (error) {
      console.error(error);

      if (error instanceof AchievementRegisterExistsError)
        return res.status(400).json({
          error: error.message,
          code: errorCodes.ACHIEVEMENT_REGISTER_ALREADY_EXISTS,
        });
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
