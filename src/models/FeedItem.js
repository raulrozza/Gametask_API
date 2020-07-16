const { Schema, model } = require('mongoose');
const LevelInfoSchema = require('./utils/LevelInfoSchema');
const RankSchema = require('./utils/RankSchema');

const FeedItem = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['achievement', 'activity', 'level', 'rank'],
      required: true,
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: 'Activity',
      default: undefined,
    },
    achievement: {
      type: Schema.Types.ObjectId,
      ref: 'Achievement',
      default: undefined,
    },
    level: {
      type: LevelInfoSchema,
      default: {
        level: 0,
        requiredExperience: 0,
      },
    },
    rank: {
      type: RankSchema,
      default: {
        name: ' ',
        tag: ' ',
      },
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {},
);

module.exports = model('FeedItem', FeedItem);
