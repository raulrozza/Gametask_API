import mongoose from 'mongoose';

// Actions
import handleLevelUp from '@actions/handleLevelUp';
import handleRemoveActivityRegister from '@actions/handleRemoveActivityRegister';

// Models
import Activity from '@models/Activity';
import FeedItem, { IFeedItem } from '@models/FeedItem';
import Game from '@models/Game';
import Player from '@models/Player';

// Types
import { Request, Response } from 'express';

/* 
  This controller manages the game level info configuration
*/
export default {
  async store(req: Request, res: Response) {
    const {
      userId,
      playerId,
      activityId,
      registerId,
      experience,
      completionDate,
    } = req.body;
    const game = req.game;

    try {
      const session = await mongoose.startSession().catch(error => {
        throw error;
      });

      await session.startTransaction();

      try {
        // Register player acomplishment in the activity history
        const activityHistory = {
          user: userId,
          log: completionDate,
        };

        // Give the player experience
        await Player.updateOne(
          { _id: playerId, user: userId, game },
          {
            $inc: {
              experience,
            },
          },
          {
            session,
          },
        ).then(() => {
          // Level up the player properly, getting the new level info
          return handleLevelUp(playerId, game, session);
        });

        // Register in activity history
        await Activity.updateOne(
          { _id: activityId },
          {
            $push: {
              history: {
                $each: [activityHistory],
                $position: 0,
              },
            },
          },
          {
            session,
          },
        );

        // delete activity register
        await handleRemoveActivityRegister(registerId, game, { session });

        // add info in the item feed
        await FeedItem.create<IFeedItem>(
          [
            {
              player: playerId,
              type: 'activity',
              activity: activityId,
              game,
              date: new Date(),
            },
          ],
          { session },
        );

        // add xp in the weekly ranking
        const foundGame = await Game.findById(game);
        if (!foundGame) throw new Error();

        // Searches for an entry of the player on the ranking
        const index = foundGame.weeklyRanking.findIndex(
          ranking => String(ranking.player) === String(playerId),
        );

        // If the player is not in the ranking, we push it into
        if (index < 0)
          await Game.updateOne(
            { _id: game },
            {
              $push: {
                weeklyRanking: {
                  player: playerId,
                  currentExperience: experience,
                },
              },
            },
            { session },
          );
        // Otherwise, we increase its experience in the ranking
        else
          await Game.updateOne(
            { _id: game, 'weeklyRanking.player': playerId },
            {
              $inc: {
                'weeklyRanking.$.currentExperience': experience,
              },
            },
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
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
