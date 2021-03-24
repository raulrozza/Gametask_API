import { Schema, model, Document } from 'mongoose';

import { IActivity, IActivityLog, IHistory } from '@modules/games/entities';
import ActivityLogSchema from './ActivityLog';
import HistorySchema from './History';
import { IGameDocument } from './Game';

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

interface IActivityBaseDocument extends Omit<IActivity, 'id'>, Document {
  id: NonNullable<Document['id']>;
  history: IHistory[];
  changelog: IActivityLog[];
}

export interface IActivityDocument extends IActivityBaseDocument {
  game: IGameDocument['_id'];
}

export interface IActivityPopulatedDocument extends IActivityBaseDocument {
  game: IGameDocument;
}

export default model<IActivityDocument>('Activity', ActivitySchema);
