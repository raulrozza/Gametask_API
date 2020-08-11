const { Schema, model } = require('mongoose');
const { ADDRESS } = require('../config/environment');

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
    token: String,
    image: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

UserSchema.virtual('profile_url').get(function () {
  return `${ADDRESS}/files/user/${this.image}`;
});

module.exports = model('User', UserSchema);
