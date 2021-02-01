import { IUserDocument } from '@models/User';
import mongoose, { Types } from 'mongoose';

export interface IHistory {
  user: Types.ObjectId | IUserDocument;
  log: Date;
}

const HistorySchema = new mongoose.Schema<IHistory>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    log: {
      type: Date,
      required: true,
    },
  },
  {
    _id: false,
  },
);

export default HistorySchema;
