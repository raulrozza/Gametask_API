import { Document, model, Schema } from 'mongoose';
import { IGameDocument } from '@shared/infra/mongoose/entities/Game';
import { ILeaderboard } from '@shared/domain/entities';
import PositionSchema, {
  IPositionDocument,
} from '@shared/infra/mongoose/entities/Position';

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
