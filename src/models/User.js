const { Schema, model} = require('mongoose');

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: String,
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