import mongoose, { Types } from 'mongoose';
import { IPlayerDocument } from './Player';

export interface IPlayerRanking {
  player: Types.ObjectId | IPlayerDocument;
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
