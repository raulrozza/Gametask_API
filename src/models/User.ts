import { Document, Schema, model } from 'mongoose';
import config from 'config/environment';

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  token?: string;
  image?: string;
}

export interface IUserDocument extends IUser, Document {
  profile_url: string;
}

const UserSchema = new Schema<IUser>(
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
    token: String,
    image: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

UserSchema.virtual('profile_url').get(function (this: IUser) {
  return `${config.ADDRESS}/files/user/${this.image}`;
});

export default model<IUserDocument>('User', UserSchema);
