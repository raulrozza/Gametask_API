const { Schema, model} = require('mongoose');
const { PORT, ADDRESS } = require('../../config');

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
        type: Object,
        default: {},
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
    return `${ADDRESS}:${PORT}/files/game/${this.image}`
})

module.exports = model('Game', GameSchema);