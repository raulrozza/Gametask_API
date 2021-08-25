import { Schema, model, Document, Types } from 'mongoose';

import { IPlayer } from '@modules/players/domain/entities';
import { IAchievementDocument } from '@modules/games/infra/mongoose/entities/Achievement';
import { IUserDocument } from '@shared/infra/mongoose/entities/User';
import { ITitleDocument } from '@shared/infra/mongoose/entities/Title';
import RankSchema from '@shared/infra/mongoose/entities/Rank';

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
