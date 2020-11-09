const Player = require('../models/Player');
const Game = require('../models/Game');
const FeedItem = require('../models/FeedItem');

module.exports = async (playerId, gameId, session) => {
  return new Promise((resolve, reject) => {
    let player, game;

    Promise.all([
      Player.findById(playerId)
        .session(session)
        .then(response => {
          player = response;
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
          .find(level => level.requiredExperience <= player.experience);

        if (higherLevel.level > player.level) {
          // LEVEL UP!
          const newLevel = higherLevel.level;

          // Did the player rank up?
          const [newRank] = game.ranks
            .filter(
              rank =>
                rank.level <= higherLevel.level && rank.level > player.level,
            )
            .sort((a, b) => b.level - a.level);

          // The update document
          const playerSetDoc = {
            level: newLevel,
          };
          // If the player ranked up, set the new rank
          if (newRank) playerSetDoc.rank = newRank;

          // Update the player's level and rank
          await Player.updateOne(
            { _id: playerId },
            {
              $set: playerSetDoc,
            },
            { session },
          );

          // Create a level up notification
          await FeedItem.create(
            [
              {
                player: playerId,
                type: 'level',
                level: higherLevel,
                game: gameId,
                date: new Date(),
              },
            ],
            { session },
          );

          if (newRank) {
            // player got a new rank. Let's notify it
            await FeedItem.create(
              [
                {
                  player: playerId,
                  type: 'rank',
                  rank: newRank,
                  game: gameId,
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
