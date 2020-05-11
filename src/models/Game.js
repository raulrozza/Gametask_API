const { Schema, model} = require('mongoose');

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
    }
}, {
});

module.exports = model('Game', GameSchema);