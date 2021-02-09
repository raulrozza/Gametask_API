import mongoose, { Document } from 'mongoose';
import { IHistory } from '@modules/games/entities';

interface IHistoryDocument extends IHistory, Document {}

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
