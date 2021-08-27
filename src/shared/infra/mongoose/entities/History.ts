import { IHistory } from '@shared/domain/entities';
import { IUserDocument } from '@shared/infra/mongoose/entities/User';
import mongoose, { Document } from 'mongoose';

export interface IHistoryDocument extends IHistory, Document {
  user: IUserDocument['_id'];
}

const HistorySchema = new mongoose.Schema<IHistoryDocument>(
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
