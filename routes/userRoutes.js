const express = require("express");
const router = express.Router();

const User = require("../models/userSchema");

const {
  signUpValidators,
  signUpValidationHandler,
  loginValidators,
  loginValidationHandler,
  deleteValidators,
  deleteValidationHandler,
} = require("../middlewares/users/userValidator");

const {
  signUpController,
  deleteAccountController,
  loginController,
} = require("../controllers/users");
const authGuard = require("../middlewares/authGuard");

router.get("/", authGuard, (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(users);
    }
  });
});

router.get("/emails", async (req, res) => {
  try {
    const users = await User.find({}).select({
      email: 1, // will return only email & _id
    });
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Post
router.post(
  "/signup",
  signUpValidators,
  signUpValidationHandler,
  signUpController
);

router.post("/login", loginValidators, loginValidationHandler, loginController);

// Update
router.put("/:id", (req, res) => {
  const id = req.params.id;
  User.findByIdAndUpdate(
    { _id: id },
    { $set: req.body },
    {
      useFindAndModify: false,
      new: true, // to return the updated document
    },

    (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(user);
      }
    }
  );
});

// Delete
router.delete(
  "/",
  deleteValidators,
  deleteValidationHandler,
  deleteAccountController
);

module.exports = router;
