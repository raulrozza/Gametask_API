import { Schema, model, Document } from 'mongoose';
import { IActivityDocument } from '@modules/games/infra/mongoose/entities/Activity';
import { IGameDocument } from '@modules/games/infra/mongoose/entities/Game';
import { ICompleteActivityRequest } from '@modules/players/domain/entities';
import { IUserDocument } from '@modules/users/infra/mongoose/entities/User';

const CompleteActivityRequestSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: 'Activity',
      required: true,
    },
    requestDate: {
      type: Date,
      required: true,
    },
    completionDate: {
      type: Date,
      required: true,
    },
    information: String,
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
  },
  { toJSON: { virtuals: true } },
);

interface ICompleteActivityRequestBaseDocument
  extends ICompleteActivityRequest,
    Document {
  id: NonNullable<Document['id']>;
}

export interface ICompleteActivityRequestDocument
  extends ICompleteActivityRequestBaseDocument {
  requester: IUserDocument['_id'];
  activity: IActivityDocument['_id'];
  game: IGameDocument['_id'];
}

export interface ICompleteActivityRequestPopulatedDocument
  extends ICompleteActivityRequestBaseDocument {
  requester: IUserDocument;
  activity: IActivityDocument;
  game: IGameDocument;
}

export default model<ICompleteActivityRequestDocument>(
  'CompleteActivityRequest',
  CompleteActivityRequestSchema,
);
