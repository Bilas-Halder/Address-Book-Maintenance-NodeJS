const {check, validationResult} = require("express-validator");
const createError = require("http-errors");

const User = require("../../models/userModel");

// signUp validation
const contactValidators = [
    check("firstName").custom((value, {req}) => {
        let lastName = req.body?.lastName;
        lastName = lastName ? lastName : "";
        value = value ? value : "";
        let displayName = value?.trim() + " " + lastName.trim();
        displayName = displayName.trim();

        if (
            displayName === "" ||
            displayName === undefined ||
            displayName === null ||
            displayName === " "
        ) {
            throw new Error("First Name or Last Name should be filled.");
        } else return value ? value : " ";
    }),
    check("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email address!")
        .trim(),
    check("phone")
        .trim()
        .isMobilePhone()
        .withMessage("Invalid phone number!")
        .trim(),
    check("address").isString().withMessage("Address must be a string.").trim(),
];

const contactValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        // response the errors
        res.status(500).json({
            errors: mappedErrors,
        });
    }
};

module.exports = {
    contactValidators,
    contactValidationHandler,
};
