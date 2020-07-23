const { Schema, model } = require('mongoose');
const { ADDRESS } = require('../../config');

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: String,
    experience: {
      type: Number,
      required: true,
      default: 0,
    },
    level: {
      type: Object,
      required: true,
      default: 0,
    },
    titles: {
      type: [Schema.Types.ObjectId],
      ref: 'Title',
      default: [],
    },
    currentTitle: {
      type: Schema.Types.ObjectId,
      ref: 'Title',
    },
    achievements: {
      type: [Schema.Types.ObjectId],
      ref: 'Achievement',
      default: [],
    },
    email: {
      type: String,
      required: true,
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
