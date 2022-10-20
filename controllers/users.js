const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/userModel");
// const VerificationToken = require("../models/verificationTokenModel");
const jwt = require("jsonwebtoken");
const path = require("path");

const signUpController = async (req, res) => {
  console.log({ ...req.body });
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 11);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    imgUrl: "common/MaleAvatar.png",
  });
  user.save((err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const { password, ...rest } = user._doc;
      // const randomStr = crypto.randomBytes(128).toString("hex");

      // const token = new VerificationToken({
      //   _memId: user._id,
      //   email: user.email,
      //   token: randomStr,
      // });
      // token.save(async (err, token) => {
      //   if (err) {
      //     res.status(500).send({
      //       msg: "Email not sent Please try resend verification email",
      //       data: rest,
      //     });
      //   } else {
      //     try {
      //       const info = await sendMail({
      //         to: email,
      //         subject: "Account Verification Link",
      //         textMsg:
      //           "Hello " +
      //           user.name +
      //           ",\n\n" +
      //           "Please verify your account by clicking the link: \nhttp://" +
      //           req.headers.host +
      //           "/api/v1/users/confirmation/" +
      //           email +
      //           "/" +
      //           token.token +
      //           "\n\nThank You!\n",
      //       });

      //       res.status(200).send({
      //         msg:
      //           "A verification email has been sent to " +
      //           email +
      //           ". It will be expire after 5 Minute. If you not get verification Email click on resend token.",
      //         data: rest,
      //       });
      //     } catch (err) {
      //       res.status(500).send({
      //         msg: "Email not sent Please try resend verification email",
      //       });
      //     }
      //   }
      // });

      res.status(200).send({
        msg: "Signup Successful. Please login to continue!",
        data: {
          ...rest,
        },
      });
    }
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).send({ msg: "Authentication Failed!" });
    } else {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        if (!user?.verified) {
          //write other jwt code

          const payload = {
            name: user.name,
            email: user.email,
            _id: user._id,
          };
          const accessToken = jwt.sign(
            { ...payload },
            process.env.TOKEN_SECRET,
            {
              expiresIn: "1d",
            }
          );

          const { password, ...rest } = user._doc;

          res.status(200).json({
            ...rest,
            accessToken: accessToken,
            msg: "Login Successful!",
          });
        } else {
          const link = process.env.PORT
            ? process.env.LIVE_SERVER_LINK + `/api/v1/verifyEmail/${email}`
            : `http://localhost:5000/api/v1/verifyEmail/${email}`;
          res.status(401).send({
            msg: "Verify your email to continue!",
            verificationLink: link,
            email: email,
          });
        }
      } else {
        res.status(401).send({ msg: "Authentication Failed!" });
      }
    }
  } catch (err) {
    res.status(401).send({ msg: "Authentication Failed!" });
  }
};

const deleteAccountController = (req, res) => {
  const query = { email: req.body?.email };
  User.findOne(query, async (err, data) => {
    console.log(data);
    if (err) {
      res.status(400).json(err);
    } else if (!data) {
      res.status(404).json({
        status: 404,
        message: "User Not Exist!.",
      });
    } else {
      try {
        const match = await bcrypt.compare(req.body?.password, data?.password);

        if (match) {
          User.deleteOne(query, (err, data) => {
            if (err) {
              res.status(400).json(err);
            } else {
              if (data?.deletedCount) {
                res.status(200).json({
                  status: 200,
                  msg: "Delete Successful.",
                  deletedCount: 1,
                });
              } else {
                res.status(424).json({
                  status: 424,
                  msg: "Unsuccessful! User not found.",
                  deletedCount: 0,
                });
              }
            }
          });
        } else {
          res.status(401).json({
            status: 401,
            msg: "Wrong Password.",
            deletedCount: 0,
          });
        }
      } catch (err) {
        res.status(400).json(err);
      }
    }
  });
};

module.exports = {
  signUpController,
  deleteAccountController,
  loginController,
};
