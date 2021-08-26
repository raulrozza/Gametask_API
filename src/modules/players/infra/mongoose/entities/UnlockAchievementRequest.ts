import { IGameDocument } from '@shared/infra/mongoose/entities/Game';
import { IUnlockAchievementRequest } from '@modules/players/domain/entities';
import { IUserDocument } from '@shared/infra/mongoose/entities/User';
import { Schema, model, Document } from 'mongoose';
import { IAchievementDocument } from '@shared/infra/mongoose/entities/Achievement';

export interface IUnlockAchievementRequestDocument
  extends IUnlockAchievementRequest,
    Document {
  id: NonNullable<Document['id']>;
  requester: IUserDocument['_id'];
  achievement: IAchievementDocument['_id'];
  game: IGameDocument['_id'];
}

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
  { toJSON: { virtuals: true } },
);

export default model<IUnlockAchievementRequestDocument>(
  'UnlockAchievementRequest',
  UnlockAchievementRequestSchema,
);
