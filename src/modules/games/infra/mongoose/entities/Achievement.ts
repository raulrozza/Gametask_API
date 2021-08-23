import { Schema, model, Document } from 'mongoose';
import envs from '@config/environment';
import { IGameDocument } from './Game';
import { IAchievement } from '@modules/games/domain/entities';
import { ITitleDocument } from './Title';

const AchievementSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: Schema.Types.ObjectId,
      ref: 'Title',
    },
    image: String,
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

interface IAchievementBaseDocument extends IAchievement, Document {
  id: NonNullable<Document['id']>;
  image_url: string;
}

AchievementSchema.virtual('image_url').get(function (this: IAchievement) {
  if (this.image) return `${envs.STORAGE_ADDRESS}/achievement/${this.image}`;
});

export interface IAchievementDocument extends IAchievementBaseDocument {
  game: IGameDocument['_id'];
  title: ITitleDocument['_id'];
}

export interface IAchievementPopulatedDocument
  extends IAchievementBaseDocument {
  game: IGameDocument;
  title: ITitleDocument;
}

export default model<IAchievementDocument>('Achievement', AchievementSchema);
