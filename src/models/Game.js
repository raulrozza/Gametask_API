const { Schema, model} = require('mongoose');
const { ADDRESS } = require('../../config');
const ThemeSchema  = require('./utils/ThemeSchema')

const GameSchema = new Schema({
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
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  levelInfo: {
    type: [Object],
    default: [],
  },
  weeklyRanking: {
    type: [Object],
    default: [],
  }
},{
  toJSON: {
    virtuals: true,
  }
});

GameSchema.virtual('image_url').get(function() {
  return `${ADDRESS}/files/game/${this.image}`
})

module.exports = model('Game', GameSchema);
