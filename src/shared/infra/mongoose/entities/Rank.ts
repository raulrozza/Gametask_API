import { IRank } from '@shared/domain/entities';
import { Document, Schema } from 'mongoose';

interface IRankDocument extends IRank, Document {}

const RankSchema = new Schema<IRankDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: 'transparent',
    },
  },
  {
    _id: false,
  },
);

export default RankSchema;
