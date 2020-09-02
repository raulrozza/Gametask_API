const mongoose = require('mongoose');

const WeeklyRanking = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    currentExperience: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

module.exports = WeeklyRanking;
