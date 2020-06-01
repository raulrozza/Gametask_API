const { Schema, model} = require('mongoose');
const ADDRESS = require('ip').address();
const { PORT, LOCAL } = require('../../config');


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
},{
    toJSON: {
      virtuals: true,
    }
});

AchievementSchema.virtual('image_url').get(function() {
    return `${LOCAL ? 'http' : 'https'}://${ADDRESS}:${PORT}/files/achievement/${this.image}`
})

module.exports = model('Achievement', AchievementSchema);