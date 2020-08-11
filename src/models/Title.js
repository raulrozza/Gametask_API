const { Schema, model } = require('mongoose');

const TitleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
  },
  {},
);

module.exports = model('Title', TitleSchema);
