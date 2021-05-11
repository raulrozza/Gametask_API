"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TitleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    game: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
});
TitleSchema.set('toJSON', { virtuals: true });
exports.default = mongoose_1.model('Title', TitleSchema);
