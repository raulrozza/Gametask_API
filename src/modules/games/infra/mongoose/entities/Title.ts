import { ITitle } from '@modules/games/domain/entities';
import { Schema, model, Document } from 'mongoose';
import { IGameDocument } from './Game';

export interface ITitleDocument extends ITitle, Document {
  id: NonNullable<Document['id']>;
  game: IGameDocument['_id'];
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
