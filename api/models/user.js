const mongoose = require('mongoose');
const Saved = require('./Saved');
const Post = require('./Post');
const Comment = require('./Comment');

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
        required: true
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
    savedMovies: [Saved.schema],
    userPost: [Post.schema],
    comments: [Comment.schema],
    verificationCode: String
});

module.exports = mongoose.model("User", userSchema);
