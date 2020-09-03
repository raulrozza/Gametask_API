const mongoose = require('mongoose');
const Player = require('../models/Player');
const Achievement = require('../models/Achievement');
const AchievementRegister = require('../models/AchievementRegister');
const Game = require('../models/Game');
const FeedItem = require('../models/FeedItem');

module.exports = {
  async store(req, res) {
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

        const pushDocument = {
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
        await FeedItem.create(
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
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
