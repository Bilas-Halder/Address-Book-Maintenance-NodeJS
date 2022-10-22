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

/*
    --- this route take query parameters and return array of selected contacts
    --- parameters can be sort, page, limit, fields(selected fields will be on the output), and other filters like firstName=bilas
    --- Ex : /contacts?page=2&limit=4&fields=email,phone,displayName,-id&sort=displayName
    --- Output :  The above request will return a JSON response where we will get 5th to 8th matched contacts because the requested page is 2 and the limit is 4, and those will be sorted by displayName in ascending order, and there will be only Email, Phone and Display Name on the contacts details.
*/
router.get("/", authGuard, getQueryController);

// Export all contacts
router.get("/export", authGuard, exportContactsController);

// Get single contact
router.get("/:id", authGuard, getSingleContactController);

// Post a contact
router.post(
    "/",
    authGuard,
    contactValidators,
    contactValidationHandler,
    singlePostController
);

// Post multiple contact with csv file
router.post("/import", authGuard, uploadCSVfile, importContactsController);

// Delete a contact
router.delete("/:id", authGuard, deleteContactController);

// Update a contact
router.patch(
    "/:id",
    authGuard,
    contactUpdateValidators,
    contactValidationHandler,
    updateContactController
);

module.exports = router;
