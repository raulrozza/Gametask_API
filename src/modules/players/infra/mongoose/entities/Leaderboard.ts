import { Document, model, Schema } from 'mongoose';
import PositionSchema from '@modules/players/infra/mongoose/entities/Position';
import { ILeaderboard } from '@modules/players/entities';
import { IGameDocument } from '@modules/games/infra/mongoose/entities/Game';

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

interface ILeaderboardBaseDocument extends ILeaderboard, Document {
  id: NonNullable<Document['id']>;
}

export interface ILeaderboardDocument extends ILeaderboardBaseDocument {
  game: IGameDocument['id'];
}

export default model<ILeaderboardDocument>('Leaderboard', LeaderboardSchema);
