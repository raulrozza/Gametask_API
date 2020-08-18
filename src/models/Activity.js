const { Schema, model } = require('mongoose');
const HistorySchema = require('./utils/HistorySchema');
const LogSchema = require('./utils/LogSchema');

const ActivitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    experience: {
      type: Number,
      required: true,
    },
    dmRules: String,
    history: {
      type: [HistorySchema],
      default: [],
    },
    changelog: {
      type: [LogSchema],
      default: [],
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
  },
  {},
);

module.exports = model('Activity', ActivitySchema);
