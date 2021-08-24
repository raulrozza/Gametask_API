import { Document, model, Schema } from 'mongoose';
import { ILeaderboard } from '@modules/players/entities';
import { IGameDocument } from '@modules/games/infra/mongoose/entities/Game';
import PositionSchema, {
  IPositionDocument,
} from '@modules/games/infra/mongoose/entities/Position';

export interface ILeaderboardDocument extends ILeaderboard, Document {
  id: NonNullable<Document['id']>;
  game: IGameDocument['id'];
  position: IPositionDocument[];
}

const LeaderboardSchema = new Schema(
  {
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    position: {
      type: [PositionSchema],
      default: [],
    },
    createdAt: {
      type: Date,
      required: true,
    },
    expiresAt: Date,
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

export default model<ILeaderboardDocument>('Leaderboard', LeaderboardSchema);