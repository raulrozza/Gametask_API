const mongoose = require('mongoose');

const WeeklyRanking = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
