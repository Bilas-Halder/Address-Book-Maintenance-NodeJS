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
    updateContactController,
    exportContactsController,
    importContactsController,
} = require("../controllers/contacts");

const {uploadCSVfile} = require("../services/utils/fileUpload");

const authGuard = require("../middlewares/authGuard");

router.get("/", authGuard, getQueryController);

// Export all contacts
router.get("/export", exportContactsController);

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

router.post("/import", authGuard, uploadCSVfile, importContactsController);

// Delete
router.delete("/:id", authGuard, deleteContactController);

// Update
router.patch(
    "/:id",
    authGuard,
    contactUpdateValidators,
    contactValidationHandler,
    updateContactController
);

module.exports = router;
