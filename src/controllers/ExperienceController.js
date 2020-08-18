const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const Player = require('../models/Player');
const handleLevelUp = require('../actions/handleLevelUp');
const handleRemoveActivityRegister = require('../actions/handleRemoveActivityRegister');
const FeedItem = require('../models/FeedItem');
const Game = require('../models/Game');

/* 
  This controller manages the game level info configuration
*/
module.exports = {
  async store(req, res) {
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
          handleLevelUp(playerId, game, session);
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
        await FeedItem.create(
          [
            {
              player: playerId,
              type: 'activity',
              activity: activityId,
              date: new Date(),
            },
          ],
          { session },
        );

        // add xp in the weekly ranking
        await Game.findById(game)
          .session(session)
          .then(({ weeklyRanking }) => {
            // Searches for an entry of the player on the ranking
            const index = weeklyRanking.findIndex(
              ranking => ranking.player === playerId,
            );

            // If the player is not in the ranking, we push it into
            if (index < 0)
              weeklyRanking = [
                ...weeklyRanking,
                { player: playerId, currentExperience: experience },
              ];
            // Otherwise, we increase its experience in the ranking
            else
              weeklyRanking[index] = {
                ...weeklyRanking[index],
                currentExperience:
                  weeklyRanking[index].currentExperience + experience,
              };

            return Game.updateOne(
              { _id: game },
              {
                $set: {
                  weeklyRanking,
                },
              },
              { session },
            );
          });

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }

      return res.status(201);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
};
