import { Schema, model, Document } from 'mongoose';
import HistorySchema, { IHistory } from 'models/utils/HistorySchema';
import LogSchema, { ILog } from 'models/utils/LogSchema';

export interface IActivity extends Document {
  name: string;
  description?: string;
  experience: number;
  dmRules?: string;
  history: IHistory[];
  changelog: ILog[];
  game: string;
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

export default model<IActivity>('Activity', ActivitySchema);
