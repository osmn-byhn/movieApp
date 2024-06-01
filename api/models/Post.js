const mongoose = require('mongoose');
const CommentPost = require('./CommentPost');

const postSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MovieLists",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    details: {
        type: String,
        required: false
    },
    likeNumber: {
        type: Number
    },
    dislikeNumber: {
        type: Number
    },
    isWatched: {
        type: Boolean,
        required: true
    },
    comments: [CommentPost.schema]
});

module.exports = mongoose.model("Post", postSchema);
