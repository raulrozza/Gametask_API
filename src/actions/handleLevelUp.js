const User = require('../models/User');
const Game = require('../models/Game');
const FeedItem = require('../models/FeedItem');

module.exports = async (userId, gameId, session) => {
  return new Promise((resolve, reject) => {
    let user, game;

    Promise.all([
      User.findById(userId)
        .session(session)
        .then(response => {
          user = response;
        }),
      Game.findById(gameId)
        .session(session)
        .then(response => {
          game = response;
        }),
    ])
      .then(async () => {
        const higherLevel = game.levelInfo
          .sort((a, b) => b.requiredExperience - a.requiredExperience)
          .find(level => level.requiredExperience <= user.experience);

        if (higherLevel.level > user.level) {
          // LEVEL UP!
          const newLevel = higherLevel.level;

          // Did the user rank up?
          const [newRank] = game.ranks
            .filter(
              rank =>
                rank.level <= higherLevel.level && rank.level > user.level,
            )
            .sort((a, b) => b.level - a.level);

          // Update the user's level
          await User.updateOne(
            { _id: userId },
            {
              $set: {
                level: newLevel,
              },
            },
            { session },
          );

          // Create a level up notification
          await FeedItem.create(
            [
              {
                user: userId,
                type: 'level',
                level: higherLevel,
                date: new Date(),
              },
            ],
            { session },
          );

          if (newRank) {
            // User got a new rank. Let's notify it
            await FeedItem.create(
              [
                {
                  user: userId,
                  type: 'rank',
                  rank: newRank,
                  date: new Date(),
                },
              ],
              { session },
            );
          }
        }
      })
      .then(resolve)
      .catch(reject);
  });
};
