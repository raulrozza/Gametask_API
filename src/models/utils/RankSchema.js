const { Schema } = require('mongoose');

const RankSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: 'transparent',
    },
  },
  {
    _id: false,
  },
);

module.exports = RankSchema;
