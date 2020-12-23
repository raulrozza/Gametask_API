import { Schema, model, Document } from 'mongoose';

export interface IActivityRegister extends Document {
  requester: string;
  activity: string;
  requestDate: Date;
  completionDate: Date;
  information: string;
  game: string;
}

const ActivityRegisterSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: 'Activity',
      required: true,
    },
    requestDate: {
      type: Date,
      required: true,
    },
    completionDate: {
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

export default model<IActivityRegister>(
  'ActivityRegister',
  ActivityRegisterSchema,
);
