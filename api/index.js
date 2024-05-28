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
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
const secretKey = "secretKey"

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to Mongodb");
}).catch((err) => {
  console.log("Error Connecting to Mongodb: ", err);
})
app.listen(process.env.PORT, () => {
  console.log("server running on: ", process.env.PORT);
})

app.use('/user', userRoute)

app.put("/posts/:postId/:userId/like", async (req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.params.userId
    const decodedUserId = jwt.verify(userId, secretKey);
    const post = await Post.findById(postId).populate("user", "fullName username profilePicture")
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: decodedUserId.userId } },
      { new: true }
    )
    updatedPost.user = post.user;
    if (!updatedPost) {
      return res.status(404).json({ message: "post not found" })
    }
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred while liking" })
  }
})

app.get("/decode/:userId", async (req, res) => {
  try {
    const userId = req.params.userId
    const decodedUserId = jwt.verify(userId, secretKey);
    res.status(200).json(decodedUserId.userId)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while decoding token to id" })
  }
})


app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const decodedUserId = await jwt.verify(userId, secretKey);
    const user = await User.findById(decodedUserId.userId);
    console.log("user: ", user);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while getting user" });
  }
});

