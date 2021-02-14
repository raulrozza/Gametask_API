import { IAchievementDocument } from '@modules/games/infra/mongoose/entities/Achievement';
import { IGameDocument } from '@modules/games/infra/mongoose/entities/Game';
import { IUnlockAchievementRequest } from '@modules/players/entities';
import { IUserDocument } from '@modules/users/infra/mongoose/entities/User';
import { Schema, model, Document } from 'mongoose';

const UnlockAchievementRequestSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    achievement: {
      type: Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true,
    },
    requestDate: {
      type: Date,
      required: true,
    },
    information: {
      type: String,
      required: false,
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
  },
  {},
);

interface IUnlockAchievementRequestBaseDocument
  extends IUnlockAchievementRequest,
    Document {
  id: NonNullable<Document['id']>;
}

export interface IUnlockAchievementRequestDocument
  extends IUnlockAchievementRequestBaseDocument {
  requester: IUserDocument['_id'];
  achievement: IAchievementDocument['_id'];
  game: IGameDocument['_id'];
}

export interface IUnlockAchievementRequestPopulatedDocument
  extends IUnlockAchievementRequestBaseDocument {
  requester: IUserDocument;
  achievement: IAchievementDocument;
  game: IGameDocument;
}

export default model<IUnlockAchievementRequestDocument>(
  'UnlockAchievementRequest',
  UnlockAchievementRequestSchema,
);
