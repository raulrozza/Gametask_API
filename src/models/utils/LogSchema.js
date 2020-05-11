const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    version: {
        type: Number,
        required: true,
    },
    log: {
        type: Date,
        required: true,
    },
    changes: {
        type: Object,
        required: true,
    }
}, {
});

module.exports =  LogSchema;