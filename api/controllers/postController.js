const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const path = require('path');
const userRoute = require("./routes/userRoute")
const User = require('../models/user')
const Post = require('../models/Post')
const MovieList = require('../models/MovieList')
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
const secretKey = "secretKey"



exports.sendPost = async (req, res) => {
    try {
        const { userId, details, movieId } = req.body;
        const user = await User.findById(userId);
        const isWatchedValue = await MovieList.findOne({ movieId })
        if (!user) return res.status(500).json({message: "User is not found"});
        const newPost = new Post({
            movieId,
            userId,
            details,
            isWatched: isWatchedValue.isWatched
        });
        await newPost.save();
        res.status(200).json({ message: "Success your post" });
    } catch (error) {
        res.status(500).json({ message: error })
    }
}