import { Schema, model, Document } from 'mongoose';
import envs from '@config/environment';

import { IGame, IRank } from '@modules/games/entities';
import { IUserDocument } from '@modules/users/infra/mongoose/entities/User';

import ThemeSchema from './Theme';
import LevelInfoSchema from './LevelInfoSchema';
import RankSchema from './Rank';

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
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

interface IGameBaseDocument extends Omit<IGame, 'id'>, Document {
  id: NonNullable<Document['id']>;
  image_url: string;
  ranks: IRank[];
  newRegisters: number;
}

export interface IGameDocument extends IGameBaseDocument {
  administrators: IUserDocument['_id'][];
}

export interface IGamePopulatedDocument extends IGameBaseDocument {
  administrators: IUserDocument[];
}

GameSchema.virtual('image_url').get(function (this: IGame) {
  if (this.image) return `${envs.STORAGE_ADDRESS}/game/${this.image}`;
});

export default model<IGameDocument>('Game', GameSchema);
