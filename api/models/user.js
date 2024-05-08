const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    MovieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

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
    isWatched : {
        type: Boolean,
        default: false
    }
});

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/149/149071.png"
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    sentFollowRequest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    receivedFollowRequest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    savedMovies: [savedSchema],
    comments: [commentSchema]  // Yorumları temsil etmek için commentSchema'yi ekleyin
});

const User = mongoose.model("User", userSchema);

module.exports = User;
