const { Schema, model } = require('mongoose');
const { ADDRESS } = require('../../config');

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
