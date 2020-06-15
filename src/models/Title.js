const { Schema, model } = require('mongoose');

const TitleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {},
);

module.exports = model('Title', TitleSchema);
