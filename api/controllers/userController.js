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
const User = require("../models/user")
const secretKey = "secretKey"

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


exports.settingCode = async (req, res) => {
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
}

exports.register = async (req, res) => {
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
}
exports.editProfile = async (req, res) => {
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
}

exports.verifyToken = async (req, res) => {
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
}

exports.resetPasswords = async (req, res) => {
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
}


exports.changePassword = async (req, res) => {
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
            { new: true }
        );
        res.status(200).send({ message: `Password successfully changed!` });
    } catch (error) {
        res.status(500).send({ message: `Password change failed: ${error}` });
    }
}

exports.login = async (req, res) => {
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
}

exports.getUser = async (req, res) => {
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
}

exports.follow = async (req, res) => {
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
}

exports.unfollow = async (req, res) => {
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
}