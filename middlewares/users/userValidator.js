const { check, validationResult } = require("express-validator");
const createError = require("http-errors");

const User = require("../../models/userModel");

// signUp validation
const signUpValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name should only contain alphabet and space")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already is in use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  // strong one -> /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
  // /^[A-Za-z @$!%*#;?&\d]{6,10}$/
  check("password")
    .matches(/^[A-Za-z @$!%*#;?&\d]{6,20}$/)
    .withMessage(
      "Password must be at least 6 characters long & should contain only alphabet, number & symbols"
    ),
];

const loginValidators = [
  check("email").isEmail().withMessage("Authentication Failed!").trim(),
  // strong one -> /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
  // /^[A-Za-z @$!%*#;?&\d]{6,10}$/
  check("password")
    .matches(/^[A-Za-z @$!%*#;?&\d]{6,20}$/)
    .withMessage("Authentication Failed!"),
];

const signUpValidationHandler = function (req, res, next) {
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
const loginValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // response the errors
    res.status(401).json({
      msg: "Authentication Failed!",
    });
  }
};

module.exports = {
  signUpValidators,
  signUpValidationHandler,
  loginValidators,
  loginValidationHandler,
  deleteValidators: loginValidators,
  deleteValidationHandler: loginValidationHandler,
};
