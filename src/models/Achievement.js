const { Schema, model} = require('mongoose');
const { PORT, ADDRESS } = require('../../config');


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
    return `${ADDRESS}:${PORT}/files/achievement/${this.image}`
})

module.exports = model('Achievement', AchievementSchema);