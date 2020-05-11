const { Schema, model} = require('mongoose');

const RankSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        required: true,
    },
}, {
});

module.exports = model('Rank', RankSchema);