import mongoose, { Types } from 'mongoose';
import Player from '@models/Player';
import Achievement from '@models/Achievement';
import AchievementRegister from '@models/AchievementRegister';
import Game from '@models/Game';
import FeedItem, { IFeedItem } from '@models/FeedItem';
import { Request, Response } from 'express';
import { BadRequestError, errorCodes } from '@utils/Errors';

export default {
  async store(req: Request, res: Response) {
    const { userId, playerId, achievementId, registerId } = req.body;
    const game = req.game;

    try {
      const session = await mongoose.startSession().catch(error => {
        throw error;
      });

      try {
        await session.startTransaction();

        // Check if the achievement has a title
        const achievement = await Achievement.findById(achievementId);

        if (!achievement) throw new BadRequestError();

        interface PushDocument {
          achievements: Types.ObjectId;
          titles?: Types.ObjectId;
        }

        const pushDocument: PushDocument = {
          achievements: achievementId,
        };

        if (achievement.title) pushDocument.titles = achievement.title;

        // Give achievement to player
        await Player.updateOne(
          { _id: playerId, user: userId, game },
          {
            $push: pushDocument,
          },
          {
            session,
          },
        );

        // Remove achievement register
        await AchievementRegister.deleteOne(
          { _id: registerId },
          {
            session,
          },
        );

        await Game.updateOne(
          { _id: game },
          {
            $inc: {
              newRegisters: -1,
            },
          },
          {
            session,
          },
        );

        // Create feed item for acomplishment
        await FeedItem.create<IFeedItem>(
          [
            {
              player: playerId,
              type: 'achievement',
              achievement: achievementId,
              game,
              date: new Date(),
            },
          ],
          { session },
        );

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }

      return res.status(201).send();
    } catch (error) {
      if (error instanceof BadRequestError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.BAD_REQUEST_ERROR });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
