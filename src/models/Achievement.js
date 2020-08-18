const { Schema, model } = require('mongoose');
const { ADDRESS } = require('../config/environment');

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

AchievementSchema.virtual('image_url').get(function () {
  return `${ADDRESS}/files/achievement/${this.image}`;
});

module.exports = model('Achievement', AchievementSchema);
