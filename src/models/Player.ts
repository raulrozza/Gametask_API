import { Schema, model, Document } from 'mongoose';
import RankSchema, { IRank } from 'models/utils/RankSchema';

export interface IPlayer extends Document {
  experience: number;
  level: number;
  titles: string[];
  currentTitle?: string;
  rank: IRank;
  user: string;
  game: string;
}

const PlayerSchema = new Schema(
  {
    experience: {
      type: Number,
      required: true,
      default: 0,
    },
    level: {
      type: Object,
      required: true,
      default: 0,
    },
    titles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Title',
        },
      ],
      default: [],
    },
    currentTitle: {
      type: Schema.Types.ObjectId,
      ref: 'Title',
    },
    rank: {
      type: RankSchema,
      default: null,
    },
    achievements: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Achievement',
        },
      ],
      default: [],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
  },
  {},
);

export default model<IPlayer>('Player', PlayerSchema);
