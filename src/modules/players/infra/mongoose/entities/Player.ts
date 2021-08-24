import { Schema, model, Document, Types } from 'mongoose';

import RankSchema from '@modules/games/infra/mongoose/entities/Rank';
import { IPlayer } from '@modules/players/domain/entities';
import { ITitleDocument } from '@modules/games/infra/mongoose/entities/Title';
import { IAchievementDocument } from '@modules/games/infra/mongoose/entities/Achievement';
import { IUserDocument } from '@modules/users/infra/mongoose/entities/User';

export interface IPlayerDocument extends Omit<IPlayer, 'id'>, Document {
  id: NonNullable<Document['id']>;
  titles: Types.Array<ITitleDocument['_id']>;
  currentTitle?: ITitleDocument['_id'];
  achievements: Types.Array<IAchievementDocument['_id']>;
  user: IUserDocument['_id'];
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
  {
    toJSON: {
      virtuals: true,
    },
  },
);

export default model<IPlayerDocument>('Player', PlayerSchema);
