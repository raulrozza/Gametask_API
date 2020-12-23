import { Schema, model, Document, Types } from 'mongoose';
import config from 'config/environment';
import LevelInfoSchema, { ILevelInfo } from 'models/utils/LevelInfoSchema';
import ThemeSchema, { ITheme } from 'models/utils/ThemeSchema';
import RankSchema, { IRank } from 'models/utils/RankSchema';
import WeeklyRanking, { IWeeklyRanking } from 'models/utils/WeeklyRanking';
import { IUserDocument } from './User';

export interface IGame {
  name: string;
  description: string;
  theme: ITheme;
  image?: string;
  administrators: Types.ObjectId[] | IUserDocument[];
  levelInfo: ILevelInfo;
  newRegisters: number;
  ranks: IRank[];
  weeklyRanking: IWeeklyRanking[];
}

const GameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    theme: {
      type: ThemeSchema,
      default: {
        primary: '#FFFFFF',
        secondary: '#852c80',
      },
    },
    image: String,
    administrators: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
    levelInfo: {
      type: [LevelInfoSchema],
      default: [
        {
          level: 0,
          requiredExperience: 0,
        },
      ],
    },
    newRegisters: {
      type: Number,
      default: 0,
    },
    ranks: {
      type: [RankSchema],
      default: [],
    },
    weeklyRanking: {
      type: [WeeklyRanking],
      default: [],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

interface IGameBaseDocument extends IGame, Document {
  image_url: string;
}

export interface IGameDocument extends IGameBaseDocument {
  administrators: IUserDocument['_id'][];
}

export interface IGamePopulatedDocument extends IGameBaseDocument {
  administrators: IUserDocument[];
}

GameSchema.virtual('image_url').get(function (this: IGame) {
  return `${config.ADDRESS}/files/game/${this.image}`;
});

export default model<IGameDocument>('Game', GameSchema);
