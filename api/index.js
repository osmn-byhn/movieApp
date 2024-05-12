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
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

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
const User = require("./models/user")
const secretKey = "secretKey"
app.post("/register", async (req, res) => {
  try {
    const { fullName, username, email, password, profilePicture } = req.body;
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" })
    }
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(400).json({ message: "Username already registered" })
    }

    const newUser = new User({ fullName, username, email, password, profilePicture });
    console.log("username: ", newUser);
    newUser.verificationToken = crypto.randomBytes(20).toString("hex")
    newUser.verificationCode = crypto.randomBytes(20).toString("hex")
    await newUser.save();
    sendVerificationEmail(newUser.email, newUser.verificationToken, 'verify')
    res.status(200).json({ message: "Registeration successful, please check your email for vertification" })
  } catch (error) {
    console.log("error registering user", error);
    res.status(500).json({ message: "error registering user" })
  }
})

app.post("/setting-code", async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email })
  console.log("existingUser: ", existingUser)
  if (!existingUser) {
    return res.status(400).json({ status: "fail", message: "Email not found!" });
  }
  try {
    sendVerificationEmail(email, existingUser.verificationCode, 'reset-password')
    //existingUser.verificationCode = crypto.randomBytes(20).toString("hex")
    res.status(200).json({ status: "success", message: "Link sending successfully, please check your email for reset password" })

  } catch (error) {
    console.log("ERROR: ", error);
    res.status(500).json({ status: "fail", message: "A catch error while sending reset link to mail" })
  }
});



app.put("/edit-profile/:userId", async (req, res) => {
  try {
    const { fullName, username, password, profilePicture } = req.body;
    const userId = req.params.userId;
    const decodedUserId = jwt.verify(userId, secretKey);
    const updatedUser = await User.findByIdAndUpdate(
      decodedUserId.userId,
      {
        fullName,
        username,
        password,
        biography,
        profilePicture
      }
    );

    if (username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: decodedUserId.userId } });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already registered" });
      }
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.log("Error updating profile:", error);
    res.status(500).json({ message: "An error occurred while updating the profile" });
  }
});

const sendVerificationEmail = async (email, verificationToken, type) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let message = '';

  if (type === "verify") {
    message = `Please click the following link to verify your email http://localhost:3000/verify/${verificationToken}`;
  }
  else if (type === "reset-password") {
    message = `Please click the following link to verify your email http://localhost:3000/reset-password/${verificationToken}`;
  }

  const mailOptions = {
    from: "osmanbeyhan12@gmail.com",
    to: email,
    subject: "Email Verification",
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending email", error);
    //res.status(500).send(error)
  }
};

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" })
    }

    user.verified = true;
    //user.verificationToken = undefined
    await user.save()

    res.send(`
      <html>
        <head>
          <title>Email Verification</title>
        </head>
        <body>
          <h1>Email Verification</h1>
          <p>Your email has been verified successfully!</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Email vertification failed" })
  }
})

app.get("/reset-password/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationCode: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" })
    }
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Email vertification failed" })
  }
});


app.post("/change-password/:token", async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;
  const user = await User.findOne({ verificationCode: token });

  try {
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { 
        password: password,
        verificationCode: crypto.randomBytes(20).toString("hex")
      },
      { new: true } // Güncellenmiş belgeyi döndürmek için { new: true } seçeneğini kullanın
    );
    res.status(200).send({ message: `Password successfully changed!` });
  } catch (error) {
    res.status(500).send({ message: `Password change failed: ${error}` });
  }

});



app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email" })
    }
    if (user.password !== password) {
      return res.status(404).json({ message: "Invalid password" })
    }
    const token = jwt.sign({ userId: user._id }, secretKey)
    res.status(200).json({ token })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while login post" })
  }
})



app.get("/user/:userId", (req, res) => {
  try {
    const loggedInUserId = req.params.userId;
    jwt.verify(loggedInUserId, secretKey, (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Invalid token" });
      }
      const userId = decoded.userId;
      User.find({ _id: { $ne: userId } })
        .then((users) => {
          console.log(users);
          res.status(200).json(users);
        })
        .catch((error) => {
          console.log("Error: ", error);
          res.status(500).json("error");
        });
    });
  } catch (error) {
    res.status(500).json({ message: "error getting the users" });
  }
});


app.post("/follow", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;
    const decodedCurrentUserId = jwt.verify(currentUserId, secretKey);
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: decodedCurrentUserId.userId },
    });
    console.log("current: ", decodedCurrentUserId);
    console.log("selected: ", selectedUserId);
    console.log("Okey man");
    res.sendStatus(200)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in following a user" });
  }
});



app.post("/users/unfollow", async (req, res) => {
  try {
    const { loggedInUserId, targetUserId } = req.body;
    const decodedLoggedInUserId = jwt.verify(loggedInUserId, secretKey);
    console.log("current: ", decodedLoggedInUserId.userId);
    console.log("selected: ", targetUserId);
    const userToUpdate = await User.findOne({
      _id: targetUserId,
      followers: decodedLoggedInUserId.userId,
    });

    if (userToUpdate) {
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: decodedLoggedInUserId.userId },
      });

      console.log("Okey man");
      res.sendStatus(200);
    } else {
      res.status(400).json({ message: "User is not following the target user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in unfollowing a user" });
  }
});




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


app.put("/posts/:postId/:userId/unlike", async (req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.params.userId
    const decodedUserId = jwt.verify(userId, secretKey);
    const post = await Post.findById(postId).populate("user", "fullName username profilePicture")
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: decodedUserId.userId } },
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


app.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "fullName username profilePicture").sort({ createdAt: -1 });
    res.status(200).json(posts)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while getting the posts" })
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

app.get("/posts/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const decodedUserId = await jwt.verify(userId, secretKey);
    const posts = await Post.find({ user: decodedUserId.userId }).populate("user", "fullName username profilePicture").sort({ createdAt: -1 })
    console.log(posts);
    res.status(200).json(posts)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while getting posts" });
  }
})

app.post("/post-replies/:postId/:userId", async (req, res) => {
  try {
    const postId = req.params.postId
    const decodedUserId = await jwt.verify(req.params.userId, secretKey);
    const content = req.body.content;
    const data = {
      content: content,
      user: decodedUserId.userId
    }
    const post = await Post.findById(postId).populate("user", "fullName username profilePicture")
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { replies: data } },
      { new: true }
    )
    updatedPost.user = post.user;
    console.log("successfully reply");
    if (!updatedPost) {
      return res.status(404).json({ message: "post not found" })
    }
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred while repling" })
  }
})

app.get("/get-replies/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("user", "fullName username profilePicture");
    const replies = await Post.populate(post.replies, { path: "user", select: "fullName username profilePicture" });
    console.log("Successfully retrieved replies: ", replies);
    res.json(replies);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while retrieving replies" });
  }
});