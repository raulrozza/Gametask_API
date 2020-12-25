import ActivityRegister from 'models/ActivityRegister';
import Game from 'models/Game';
import { ModelUpdateOptions, Types } from 'mongoose';

export default async (
  registerId: Types.ObjectId,
  gameId: Types.ObjectId,
  options: ModelUpdateOptions = {},
) => {
  await ActivityRegister.deleteOne({ _id: registerId }, options);

  await Game.updateOne(
    { _id: gameId },
    {
      $inc: {
        newRegisters: -1,
      },
    },
    options,
  );
};
