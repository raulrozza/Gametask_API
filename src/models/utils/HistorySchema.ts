import mongoose from 'mongoose';

export interface IHistory {
  user: string;
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
