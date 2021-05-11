import { ITitle } from '@modules/games/entities';
import { Schema, model, Document } from 'mongoose';
import { IGameDocument, IGamePopulatedDocument } from './Game';

export interface ITitleDocument extends ITitle, Document {
  id: NonNullable<Document['id']>;
  game: IGameDocument['_id'];
}

export interface ITitlePopulatedDocument extends ITitleDocument {
  game: IGamePopulatedDocument;
}

const TitleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
});

TitleSchema.set('toJSON', { virtuals: true });

export default model<ITitleDocument>('Title', TitleSchema);
