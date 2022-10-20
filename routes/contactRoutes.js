const express = require("express");
const router = express.Router();

const mongooseDummy = require("mongoose-dummy");

const Contact = require("../models/contactModel");

const {
    contactValidators,
    contactValidationHandler,
    contactUpdateValidators,
} = require("../middlewares/contacts/contactValidator");

const {
    singlePostController,
    getQueryController,
    deleteContactController,
    getSingleContactController,
    UpdateContactController,
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

// Get single contact
router.get("/:id", authGuard, getSingleContactController);

// Post
router.post(
    "/",
    authGuard,
    contactValidators,
    contactValidationHandler,
    singlePostController
);

// Delete
router.delete("/:id", authGuard, deleteContactController);

// Update
router.patch(
    "/:id",
    authGuard,
    contactUpdateValidators,
    contactValidationHandler,
    UpdateContactController
);

module.exports = router;
