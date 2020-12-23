import { Schema, model, Document, Types } from 'mongoose';
import LevelInfoSchema, { ILevelInfo } from 'models/utils/LevelInfoSchema';
import RankSchema, { IRank } from 'models/utils/RankSchema';
import { IPlayerDocument } from './Player';
import { IActivityDocument } from './Activity';
import { IAchievementDocument } from './Achievement';
import { IGameDocument } from './Game';

const typeEnum = ['achievement', 'activity', 'level', 'rank'] as const;

export interface IFeedItem {
  player: Types.ObjectId | IPlayerDocument;
  type: typeof typeEnum[number];
  activity?: Types.ObjectId | IActivityDocument;
  achievement?: Types.ObjectId | IAchievementDocument;
  game: Types.ObjectId | IGameDocument;
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

export interface IFeedItemDocument extends IFeedItem, Document {
  player: IPlayerDocument['_id'];
  activity?: IActivityDocument['_id'];
  achievement?: IAchievementDocument['_id'];
  game: IGameDocument['_id'];
}

export interface IFeedItemPopulatedDocument extends IFeedItem, Document {
  player: IPlayerDocument;
  activity?: IActivityDocument;
  achievement?: IAchievementDocument;
  game: IGameDocument;
}

export default model<IFeedItemDocument>('FeedItem', FeedItem);
