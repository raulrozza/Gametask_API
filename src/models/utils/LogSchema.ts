import { IUserDocument } from '@models/User';
import mongoose, { Types } from 'mongoose';

export interface ILog {
  version: number;
  log: Date;
  changes: unknown;
  userId: Types.ObjectId | IUserDocument;
}

const LogSchema = new mongoose.Schema<ILog>(
  {
    version: {
      type: Number,
      required: true,
    },
    log: {
      type: Date,
      required: true,
    },
    changes: {
      type: Object,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    _id: false,
  },
);

export default LogSchema;
