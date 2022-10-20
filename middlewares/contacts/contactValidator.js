const {check, validationResult} = require("express-validator");
const createError = require("http-errors");

const User = require("../../models/userModel");

const customCheckForDisplayName = (value, {req}) => {
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
};

// signUp validation
const contactValidators = [
    check("firstName").custom(customCheckForDisplayName),
    check("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Invalid email address!"),
    check("phone").trim().isMobilePhone().withMessage("Invalid phone number!"),
    check("address")
        .optional()
        .isString()
        .withMessage("Address must be a string."),
];
const contactUpdateValidators = [
    check("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Invalid email address!"),
    check("phone")
        .optional()
        .trim()
        .isMobilePhone()
        .withMessage("Invalid phone number!"),
    check("address")
        .optional()
        .isString()
        .withMessage("Address must be a string."),
    check("imgUrl")
        .optional()
        .isString()
        .withMessage("imgUrl must be a string."),
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
    contactUpdateValidators,
};
