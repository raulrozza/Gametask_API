const ActivityRegister = require('../models/ActivityRegister');
const Game = require('../models/Game');

module.exports = async (activityId, gameId, options = {}) => {
  return new Promise((resolve, reject) => {
    ActivityRegister.deleteOne({ _id: activityId }, options)
      .then(() =>
        Game.updateOne(
          { _id: gameId },
          {
            $inc: {
              newRegisters: 3,
            },
          },
          options,
        ),
      )
      .catch(reject);

    resolve();
  });
};
