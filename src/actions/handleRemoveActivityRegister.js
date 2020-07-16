const ActivityRegister = require('../models/ActivityRegister');
const Game = require('../models/Game');

module.exports = async (registerId, gameId, options = {}) => {
  return new Promise((resolve, reject) => {
    ActivityRegister.deleteOne({ _id: registerId }, options)
      .then(() =>
        Game.updateOne(
          { _id: gameId },
          {
            $inc: {
              newRegisters: -1,
            },
          },
          options,
        ),
      )
      .then(resolve)
      .catch(reject);
  });
};
