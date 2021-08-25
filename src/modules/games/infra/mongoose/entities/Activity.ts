import { Schema, model, Document } from 'mongoose';

import ActivityLogSchema, { IActivityLogDocument } from './ActivityLog';
import HistorySchema from './History';
import { IGameDocument } from '@shared/infra/mongoose/entities/Game';
import { IActivity } from '@shared/domain/entities';

export interface IActivityDocument extends IActivity, Document {
  id: NonNullable<Document['id']>;
  game: IGameDocument['_id'];
  changelog: IActivityLogDocument[];
}

const ActivitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    experience: {
      type: Number,
      required: true,
    },
    dmRules: String,
    history: {
      type: [HistorySchema],
      default: [],
    },
    changelog: {
      type: [ActivityLogSchema],
      default: [],
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

export default model<IActivityDocument>('Activity', ActivitySchema);
