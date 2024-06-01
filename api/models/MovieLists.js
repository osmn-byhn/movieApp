const mongoose = require('mongoose');
const CommentPost = require('./CommentPost');

const movieListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    movieId: {
        type: String,
        required: true
    },
    isWatched: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("MovieList", movieListSchema);
