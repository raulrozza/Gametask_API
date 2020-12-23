import mongoose from 'mongoose';

export interface IPlayerRanking {
  player: string;
  currentExperience: number;
}

const PlayerRanking = new mongoose.Schema<IPlayerRanking>(
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
  {},
);

export default PlayerRanking;
