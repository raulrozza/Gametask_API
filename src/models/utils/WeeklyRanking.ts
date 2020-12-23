import { IPlayerDocument } from 'models/Player';
import mongoose, { Types } from 'mongoose';

export interface IWeeklyRanking {
  player: Types.ObjectId | IPlayerDocument;
  currentExperience: number;
}

const WeeklyRanking = new mongoose.Schema<IWeeklyRanking>(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    currentExperience: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

export default WeeklyRanking;
