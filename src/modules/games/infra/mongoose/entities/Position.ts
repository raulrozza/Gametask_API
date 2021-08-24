import {
  IPosition,
  IPositionedPlayer,
} from '@modules/games/domain/entities/ILeaderboard';
import { ITitleDocument } from '@modules/games/infra/mongoose/entities/Title';
import { IUserDocument } from '@modules/users/infra/mongoose/entities/User';
import { Document, Schema } from 'mongoose';

interface IPositionedPlayerDocument extends IPositionedPlayer, Document {
  id: NonNullable<Document['id']>;
  currentTitle?: ITitleDocument['_id'];
  user: IUserDocument['_id'];
}

export interface IPositionDocument extends IPosition, Document {
  player: IPositionedPlayerDocument['_id'];
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
