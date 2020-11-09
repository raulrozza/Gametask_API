const mongoose = require('mongoose');
const Player = require('../models/Player');
const handleLevelUp = require('./handleLevelUp');

const checkPlayersLevels = async gameId => {
  try {
    const players = await Player.find({ game: gameId });

    const session = await mongoose.startSession();

    await session.startTransaction();
    try {
      const promiseArray = [];

      players.forEach(player =>
        promiseArray.push(handleLevelUp(player._id, gameId, session)),
      );

      await Promise.all(promiseArray);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error updating players.', error);
  }
};

module.exports = checkPlayersLevels;
