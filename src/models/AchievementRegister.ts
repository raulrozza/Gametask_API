import { Schema, model, Document, Types } from 'mongoose';
import { IAchievementDocument } from './Achievement';
import { IGameDocument } from './Game';

export interface IAchievementRegister {
  requester: string;
  achievement: Types.ObjectId | IAchievementDocument;
  requestDate: Date;
  information?: string;
  game: Types.ObjectId | IGameDocument;
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

export interface IAchievementRegisterDocument
  extends IAchievementRegister,
    Document {
  achievement: IAchievementDocument['_id'];
  game: IGameDocument['_id'];
}

export interface IAchievementRegisterPopulatedDocument
  extends IAchievementRegister,
    Document {
  achievement: IAchievementDocument;
  game: IGameDocument;
}

export default model<IAchievementRegisterDocument>(
  'AchievementRegister',
  AchievementRegisterSchema,
);
