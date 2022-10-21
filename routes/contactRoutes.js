const express = require("express");
const router = express.Router();

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
