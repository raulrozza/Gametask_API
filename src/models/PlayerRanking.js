const mongoose = require('mongoose');

const PlayerRanking = new mongoose.Schema(
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
  {},
);

module.exports = PlayerRanking;
