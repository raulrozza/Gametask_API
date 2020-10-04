const { Schema, model } = require('mongoose');
const { ADDRESS } = require('../config/environment');
const LevelInfoSchema = require('./utils/LevelInfoSchema');
const ThemeSchema = require('./utils/ThemeSchema');
const RankSchema = require('./utils/RankSchema');
const WeeklyRanking = require('./utils/WeeklyRanking');

const GameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    theme: {
      type: ThemeSchema,
      default: {
        primary: '#FFFFFF',
        secondary: '#852c80',
      },
    },
    image: String,
    administrators: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
    levelInfo: {
      type: [LevelInfoSchema],
      default: [
        {
          level: 0,
          requiredExperience: 0,
        },
      ],
    },
    newRegisters: {
      type: Number,
      default: 0,
    },
    ranks: {
      type: [RankSchema],
      default: [],
    },
    weeklyRanking: {
      type: [WeeklyRanking],
      default: [],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

GameSchema.virtual('image_url').get(function () {
  return `${ADDRESS}/files/game/${this.image}`;
});

module.exports = model('Game', GameSchema);
