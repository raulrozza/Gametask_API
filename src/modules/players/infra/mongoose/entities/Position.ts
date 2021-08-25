import { IPosition } from '@shared/domain/entities/ILeaderboard';
import { Document, Schema } from 'mongoose';

interface IPositionDocument extends IPosition, Document {}

const PositionSchema = new Schema<IPositionDocument>(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

export default PositionSchema;
