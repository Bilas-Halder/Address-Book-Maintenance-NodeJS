const express = require("express");
const router = express.Router();

const User = require("../models/userModel");

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
    updateAccountController,
} = require("../controllers/users");
const authGuard = require("../middlewares/authGuard");

router.get("/", authGuard, async (req, res) => {
    const userID = req.userID;
    console.log(userID);
    try {
        const user = await User.findById(userID);
        const {password, ...rest} = user._doc;
        res.status(200).send(rest);
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
router.put("/:id", authGuard, updateAccountController);

// Delete
router.delete(
    "/",
    deleteValidators,
    deleteValidationHandler,
    deleteAccountController
);

module.exports = router;
