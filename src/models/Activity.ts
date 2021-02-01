import { Schema, model, Document, Types } from 'mongoose';
import HistorySchema, { IHistory } from '@models/utils/HistorySchema';
import LogSchema, { ILog } from '@models/utils/LogSchema';
import { IGameDocument } from './Game';

export interface IActivity {
  name: string;
  description?: string;
  experience: number;
  dmRules?: string;
  history?: IHistory[];
  changelog?: ILog[];
  game: Types.ObjectId | IGameDocument;
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
      type: [LogSchema],
      default: [],
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
  },
  {},
);

interface IActivityBaseDocument extends IActivity, Document {
  history: IHistory[];
  changelog: ILog[];
}

export interface IActivityDocument extends IActivityBaseDocument {
  game: IGameDocument['_id'];
}

export interface IActivityPopulatedDocument extends IActivityBaseDocument {
  game: IGameDocument;
}

export default model<IActivityDocument>('Activity', ActivitySchema);
