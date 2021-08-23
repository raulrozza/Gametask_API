import mongoose, { Document } from 'mongoose';
import { IActivityLog } from '@modules/games/domain/entities';
import { IUserDocument } from '@modules/users/infra/mongoose/entities/User';

export interface IActivityLogDocument extends IActivityLog, Document {
  user: IUserDocument['_id'];
}

const ActivityLogSchema = new mongoose.Schema<IActivityLogDocument>(
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    _id: false,
  },
);

export default ActivityLogSchema;
