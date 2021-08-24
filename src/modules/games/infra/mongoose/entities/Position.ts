import { IPosition } from '@modules/games/domain/entities/ILeaderboard';
import { IPlayerDocument } from '@modules/players/infra/mongoose/entities/Player';
import { Document, Schema } from 'mongoose';

export interface IPositionDocument extends IPosition, Document {
  player: IPlayerDocument['_id'];
}

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
