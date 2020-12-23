import { Schema, model, Document, Types } from 'mongoose';
import RankSchema, { IRank } from 'models/utils/RankSchema';
import { ITitleDocument } from './Title';
import { IAchievementDocument } from './Achievement';
import { IUserDocument } from './User';
import { IGameDocument } from './Game';

export interface IPlayer {
  experience: number;
  level: number;
  titles: Types.ObjectId[] | ITitleDocument[];
  currentTitle?: Types.ObjectId | ITitleDocument;
  rank: IRank;
  achievements: Types.ObjectId[] | IAchievementDocument[];
  user: Types.ObjectId | IUserDocument;
  game: Types.ObjectId | IGameDocument;
}

const PlayerSchema = new Schema(
  {
    experience: {
      type: Number,
      required: true,
      default: 0,
    },
    level: {
      type: Number,
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

export interface IPlayerDocument extends IPlayer, Document {
  titles: Types.Array<ITitleDocument['_id']>;
  currentTitle?: ITitleDocument['_id'];
  achievements: Types.Array<IAchievementDocument['_id']>;
  user: IUserDocument['_id'];
  game: IGameDocument['_id'];
}

export interface IPlayerPopulatedDocument extends IPlayer, Document {
  titles: Types.Array<ITitleDocument>;
  currentTitle?: ITitleDocument;
  achievements: Types.Array<IAchievementDocument>;
  user: IUserDocument;
  game: IGameDocument;
}

export default model<IPlayerDocument>('Player', PlayerSchema);
