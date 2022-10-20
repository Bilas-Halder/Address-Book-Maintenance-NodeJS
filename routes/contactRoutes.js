const express = require("express");
const router = express.Router();

const mongooseDummy = require("mongoose-dummy");

const Contact = require("../models/contactModel");

const {
    contactValidators,
    contactValidationHandler,
} = require("../middlewares/contacts/contactValidator");

const {
    singlePostController,
    getQueryController,
} = require("../controllers/contacts");
const authGuard = require("../middlewares/authGuard");

// router.get("/", authGuard, (req, res) => {
//     const ignoredFields = [
//         "_id",
//         "createdAt",
//         "updatedAt",
//         "imgUrl",
//         "displayName",
//         "__v",
//         /detail.*_info/,
//     ];

//     const randomObjects = [];
//     for (let i = 0; i < 5; i++) {
//         let randomObject = mongooseDummy(Contact, {
//             ignore: ignoredFields,
//         });
//         randomObjects.push(randomObject);
//     }

//     res.status(200).send(randomObjects);
// });

router.get("/", authGuard, getQueryController);

// Post
router.post(
    "/",
    authGuard,
    contactValidators,
    contactValidationHandler,
    singlePostController
);

module.exports = router;
