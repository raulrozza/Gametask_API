import { Schema, model, Document } from 'mongoose';
import LevelInfoSchema, { ILevelInfo } from 'models/utils/LevelInfoSchema';
import RankSchema, { IRank } from 'models/utils/RankSchema';

const typeEnum = ['achievement', 'activity', 'level', 'rank'] as const;

export interface IFeedItem extends Document {
  player: string;
  type: typeof typeEnum[number];
  activity: string | undefined;
  achievement: string | undefined;
  game: string;
  level: ILevelInfo;
  rank: IRank;
  date: Date;
}

const FeedItem = new Schema(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    type: {
      type: String,
      enum: typeEnum,
      required: true,
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: 'Activity',
      default: undefined,
    },
    achievement: {
      type: Schema.Types.ObjectId,
      ref: 'Achievement',
      default: undefined,
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    level: {
      type: LevelInfoSchema,
      default: {
        level: 0,
        requiredExperience: 0,
      },
    },
    rank: {
      type: RankSchema,
      default: {
        name: ' ',
        tag: ' ',
      },
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {},
);

export default model<IFeedItem>('FeedItem', FeedItem);
