import { Schema, model, Document, Types } from 'mongoose';
import { IGameDocument, IGamePopulatedDocument } from './Game';

export interface ITitle {
  name: string;
  game: Types.ObjectId | IGameDocument;
}

export interface ITitleDocument extends ITitle, Document {
  game: IGameDocument['_id'];
}

export interface ITitlePopulatedDocument extends ITitleDocument {
  game: IGamePopulatedDocument;
}

const TitleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
  },
  {},
);

export default model<ITitleDocument>('Title', TitleSchema);
