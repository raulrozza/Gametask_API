import { Schema, model, Document } from 'mongoose';
import envs from '@config/environment';
import { IGameDocument } from './Game';
import { ITitleDocument } from './Title';
import { IAchievement } from '@shared/domain/entities';

export interface IAchievementDocument extends IAchievement, Document {
  id: NonNullable<Document['id']>;
  name: string;
  description: string;
  image?: string;
  image_url?: string;
  title?: ITitleDocument['_id'];
  game: IGameDocument['_id'];
}

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

AchievementSchema.virtual('image_url').get(function (this: IAchievement) {
  if (this.image) return `${envs.STORAGE_ADDRESS}/achievement/${this.image}`;
});

export default model<IAchievementDocument>('Achievement', AchievementSchema);
