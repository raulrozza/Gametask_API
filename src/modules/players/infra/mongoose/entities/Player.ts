import { Schema, model, Document, Types } from 'mongoose';

import RankSchema from '@modules/games/infra/mongoose/entities/Rank';
import { IPlayer } from '@modules/players/entities';
import { ITitleDocument } from '@modules/games/infra/mongoose/entities/Title';
import { IAchievementDocument } from '@modules/games/infra/mongoose/entities/Achievement';
import { IUserDocument } from '@modules/users/infra/mongoose/entities/User';
import { IGameDocument } from '@modules/games/infra/mongoose/entities/Game';
import { IRank } from '@shared/domain/entities';

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

interface IPlayerBaseDocument extends Omit<IPlayer, 'id'>, Document {
  id: NonNullable<Document['id']>;
  experience: number;
  level: number;
  rank: IRank;
}

export interface IPlayerDocument extends IPlayerBaseDocument {
  titles: Types.Array<ITitleDocument['_id']>;
  currentTitle?: ITitleDocument['_id'];
  achievements: Types.Array<IAchievementDocument['_id']>;
  user: IUserDocument['_id'];
  game: IGameDocument['_id'];
}

export interface IPlayerPopulatedDocument extends IPlayerBaseDocument {
  titles: Types.Array<ITitleDocument>;
  currentTitle?: ITitleDocument;
  achievements: Types.Array<IAchievementDocument>;
  user: IUserDocument;
  game: IGameDocument;
}

export default model<IPlayerDocument>('Player', PlayerSchema);
