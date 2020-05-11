const { Schema, model} = require('mongoose');

const AchievementSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    title: {
        type: Schema.Types.ObjectId,
        ref: 'Title'
    },
    image: String,
}, {
});

module.exports = model('Achievement', AchievementSchema);