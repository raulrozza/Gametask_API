const mongoose = require('mongoose');

const LevelInfo = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: true,
    },
    title: String,
    requiredExperience: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

module.exports = LevelInfo;
