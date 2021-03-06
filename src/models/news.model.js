const mongoose = require('mongoose')

const newsSchema = mongoose.Schema({
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        minlength: 0,
        maxlength: 100,
        required: true,
    },
    description: {
        type: String,
        minlength: 20,
        maxlength: 4096,
        required: true
    },
    viewer: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String,
        maxlength: 500,
        trim: true
    }
}, {
    timestamps: true
})

const News = mongoose.model('New', newsSchema)

module.exports = News