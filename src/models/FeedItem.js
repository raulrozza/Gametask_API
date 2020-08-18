const { Schema, model } = require('mongoose');
const LevelInfoSchema = require('./utils/LevelInfoSchema');
const RankSchema = require('./utils/RankSchema');

const FeedItem = new Schema(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
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
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
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
