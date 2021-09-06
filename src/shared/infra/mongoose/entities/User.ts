import { Document, Schema, model } from 'mongoose';
import envs from '@config/environment';

import { IUser } from '@shared/domain/entities';

export interface IUserDocument extends Omit<IUser, 'id'>, Document {
  id: NonNullable<Document['id']>;
}

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: String,
    email: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

UserSchema.virtual('profile_url').get(function (this: IUser) {
  if (this.image) return `${envs.STORAGE_ADDRESS}/user/${this.image}`;
});

export default model<IUserDocument>('User', UserSchema);
