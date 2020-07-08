const { Schema, model } = require('mongoose');
const LevelInfoSchema = require('./utils/LevelInfoSchema');

const FeedItem = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: 'achievement' | 'activity' | 'level',
      required: true,
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: 'Activity',
    },
    achievement: {
      type: Schema.Types.ObjectId,
      ref: 'Achievement',
    },
    level: LevelInfoSchema,
    date: {
      type: Date,
      required: true,
    },
  },
  {},
);

module.exports = model('FeedItem', FeedItem);
