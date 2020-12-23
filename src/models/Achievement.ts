import { Schema, model, Document } from 'mongoose';
import config from 'config/environment';

export interface IAchievement extends Document {
  name: string;
  description: string;
  title?: string;
  image?: string;
  game: string;
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
  return `${config.ADDRESS}/files/achievement/${this.image}`;
});

export default model<IAchievement>('Achievement', AchievementSchema);
