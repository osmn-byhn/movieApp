const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    savedAt: {
        type: Date,
        default: Date.now
    },
    isWatched: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Saved", savedSchema);
