import mongoose, { Types } from 'mongoose';
import Player from 'models/Player';
import handleLevelUp from './handleLevelUp';

const checkPlayersLevels = async (gameId: Types.ObjectId) => {
  try {
    const players = await Player.find({ game: gameId });

    const session = await mongoose.startSession();

    await session.startTransaction();
    try {
      const promiseArray: Promise<void>[] = [];

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

export default checkPlayersLevels;
