const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema(
  {
    primary: {
      type: String,
      required: true,
    },
    secondary: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

module.exports = ThemeSchema;
