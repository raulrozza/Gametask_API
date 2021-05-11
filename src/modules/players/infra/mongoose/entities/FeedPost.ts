import { Schema, model, Document } from 'mongoose';
import LevelInfoSchema from '@modules/games/infra/mongoose/entities/LevelInfoSchema';
import RankSchema from '@modules/games/infra/mongoose/entities/Rank';
import { IFeedPost } from '@modules/players/entities';
import { ILevelInfo, IRank } from '@modules/games/entities';
import { IActivityDocument } from '@modules/games/infra/mongoose/entities/Activity';
import { IAchievementDocument } from '@modules/games/infra/mongoose/entities/Achievement';
import { IGameDocument } from '@modules/games/infra/mongoose/entities/Game';
import { IPlayerDocument } from '@modules/players/infra/mongoose/entities/Player';

const typeEnum: IFeedPost['type'][] = [
  'achievement',
  'activity',
  'level',
  'rank',
];

const FeedPostSchema = new Schema(
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
  { toJSON: { virtuals: true } },
);

interface IFeedPostBaseDocument extends IFeedPost, Document {
  id: NonNullable<Document['id']>;
  level: ILevelInfo;
  rank?: IRank;
}

export interface IFeedPostDocument extends IFeedPostBaseDocument {
  player: IPlayerDocument['_id'];
  activity?: IActivityDocument['_id'];
  achievement?: IAchievementDocument['_id'];
  game: IGameDocument['_id'];
}

export interface IFeedPostPopulatedDocument extends IFeedPostBaseDocument {
  player: IPlayerDocument;
  activity?: IActivityDocument;
  achievement?: IAchievementDocument;
  game: IGameDocument;
}

export default model<IFeedPostDocument>('FeedPost', FeedPostSchema);
