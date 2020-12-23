import { Schema, model, Document, Types } from 'mongoose';
import { IActivityDocument } from './Activity';
import { IGameDocument } from './Game';
import { IUserDocument } from './User';

export interface IActivityRegister {
  requester: Types.ObjectId | IUserDocument;
  activity: Types.ObjectId | IActivityDocument;
  requestDate: Date;
  completionDate: Date;
  information: string;
  game: Types.ObjectId | IGameDocument;
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

export interface IActivityRegisterDocument extends IActivityRegister, Document {
  requester: IUserDocument['_id'];
  activity: IActivityDocument['_id'];
  game: IGameDocument['_id'];
}

export interface IActivityRegisterPopulatedDocument
  extends IActivityRegister,
    Document {
  requester: IUserDocument;
  activity: IActivityDocument;
  game: IGameDocument;
}

export default model<IActivityRegisterDocument>(
  'ActivityRegister',
  ActivityRegisterSchema,
);
