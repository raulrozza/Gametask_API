import mongoose, { Document } from 'mongoose';
import { ILevelInfo } from '@modules/games/entities';

interface ILevelInfoDocument extends ILevelInfo, Document {}

const LevelInfoSchema = new mongoose.Schema<ILevelInfoDocument>(
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

export default LevelInfoSchema;
