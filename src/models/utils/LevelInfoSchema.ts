import mongoose from 'mongoose';

export interface ILevelInfo {
  level: number;
  title?: string;
  requiredExperience: number;
}

const LevelInfo = new mongoose.Schema<ILevelInfo>(
  {
    level: {
      type: Number,
      required: true,
    },
    title: String,
    requiredExperience: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

export default LevelInfo;
