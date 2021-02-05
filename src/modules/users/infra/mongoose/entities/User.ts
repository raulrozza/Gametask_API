import { Document, Schema, model } from 'mongoose';
import envs from '@config/environment';

import { IUser } from 'src/modules/users/entities';

export interface IUserDocument extends Omit<IUser, 'id'>, Document {
  id: NonNullable<Document['id']>;
  profile_url: string;
}

const UserSchema = new Schema<IUserDocument>(
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
  return `${envs.ADDRESS}/files/user/${this.image}`;
});

export default model<IUserDocument>('User', UserSchema);
