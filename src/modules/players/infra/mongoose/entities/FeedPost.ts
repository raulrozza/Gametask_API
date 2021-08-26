import { Schema, model, Document } from 'mongoose';
import { IActivityDocument } from '@modules/games/infra/mongoose/entities/Activity';
import { IAchievementDocument } from '@modules/games/infra/mongoose/entities/Achievement';
import { IGameDocument } from '@shared/infra/mongoose/entities/Game';
import { IPlayerDocument } from '@modules/players/infra/mongoose/entities/Player';
import { IFeedPost } from '@modules/players/domain/entities';
import RankSchema from '@shared/infra/mongoose/entities/Rank';
import LevelInfoSchema from '@shared/infra/mongoose/entities/LevelInfoSchema';

const typeEnum: IFeedPost['type'][] = [
  'achievement',
  'activity',
  'level',
  'rank',
];

export interface IFeedPostDocument extends IFeedPost, Document {
  id: NonNullable<Document['id']>;
  player: IPlayerDocument['_id'];
  activity?: IActivityDocument['_id'];
  achievement?: IAchievementDocument['_id'];
  game: IGameDocument['_id'];
}

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
    },
    rank: {
      type: RankSchema,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { toJSON: { virtuals: true } },
);

export default model<IFeedPostDocument>('FeedPost', FeedPostSchema);
