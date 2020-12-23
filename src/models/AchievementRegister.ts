import { Schema, model, Document } from 'mongoose';

export interface IAchievementRegister extends Document {
  requester: string;
  achievement: string;
  requestDate: Date;
  information?: string;
  game: string;
}

const AchievementRegisterSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    achievement: {
      type: Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true,
    },
    requestDate: {
      type: Date,
      required: true,
    },
    information: String,
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
  },
  {},
);

export default model<IAchievementRegister>(
  'AchievementRegister',
  AchievementRegisterSchema,
);
