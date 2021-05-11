import { Document, Schema } from 'mongoose';
import { IPosition } from '@modules/players/entities/ILeaderboard';

interface IPositionDocument extends IPosition, Document {}

const PositionSchema = new Schema<IPositionDocument>(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    experiece: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

export default PositionSchema;
