import { Schema, model, Document, Types } from 'mongoose';
import config from 'config/environment';
import { IGameDocument } from './Game';
import { ITitleDocument } from './Title';

export interface IAchievement {
  name: string;
  description: string;
  title?: Types.ObjectId | ITitleDocument;
  image?: string;
  game: Types.ObjectId | IGameDocument;
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

interface IAchievementBaseDocument extends IAchievement, Document {
  image_url: string;
}

AchievementSchema.virtual('image_url').get(function (this: IAchievement) {
  return `${config.ADDRESS}/files/achievement/${this.image}`;
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
