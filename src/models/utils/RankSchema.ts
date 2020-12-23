import { Schema } from 'mongoose';

export interface IRank {
  name: string;
  tag: string;
  level: number;
  color: string;
}

const RankSchema = new Schema<IRank>(
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
