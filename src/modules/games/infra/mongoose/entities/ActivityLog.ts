import mongoose, { Document } from 'mongoose';
import { IActivityLog } from '@modules/games/entities';

interface IActivityLogDocument extends IActivityLog, Document {}

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

export default ActivityLogSchema;
