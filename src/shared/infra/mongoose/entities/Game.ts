import { Schema, model, Document } from 'mongoose';
import envs from '@config/environment';

import { IUserDocument } from '@shared/infra/mongoose/entities/User';

import { IGame } from '@shared/domain/entities';
import ThemeSchema from '@shared/infra/mongoose/entities/Theme';
import RankSchema from '@shared/infra/mongoose/entities/Rank';
import LevelInfoSchema from '@shared/infra/mongoose/entities/LevelInfoSchema';

export interface IGameDocument extends IGame, Document {
  id: NonNullable<Document['id']>;
  administrators: IUserDocument['_id'][];
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
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

GameSchema.virtual('image_url').get(function (this: IGame) {
  if (this.image) return `${envs.STORAGE_ADDRESS}/game/${this.image}`;
});

export default model<IGameDocument>('Game', GameSchema);
