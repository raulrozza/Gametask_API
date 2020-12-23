import mongoose from 'mongoose';

export interface IWeeklyRanking {
  player: string;
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
