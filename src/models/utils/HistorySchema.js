const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    log: {
      type: Date,
      required: true,
    },
  },
  {
    _id: false,
  },
);

module.exports = HistorySchema;
