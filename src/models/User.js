const { Schema, model} = require('mongoose');

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: String,
    experience: {
        type: Number,
        required: true,
    },
    level: {
        type: Object,
        required: true,
    },
    titles: {
        type: [Schema.Types.ObjectId],
        ref: 'Title',
        default: [],
    },
    currentTitle: {
        type: Schema.Types.ObjectId,
        ref: 'Title',
    },
    achievements: {
        type: [Schema.Types.ObjectId],
        ref: 'Achievement',
        default: [],
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    access: Boolean,
    token: String,
}, {
});

module.exports = model('User', UserSchema);