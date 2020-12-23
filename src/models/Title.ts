import { Schema, model, Document } from 'mongoose';

export interface ITitle extends Document {
  name: string;
  game: string;
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

export default model<ITitle>('Title', TitleSchema);
