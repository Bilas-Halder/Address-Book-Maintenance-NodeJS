const mongoose = require("mongoose");
const createError = require("http-errors");

const contactModel = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: String,
        displayName: String,
        email: String,
        imgUrl: String,
        phone: {
            type: String,
            required: true,
        },
        address: String,
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        frequency: {
            type: Number,
            default: 0,
        },
    },
    {timestamps: true}
);

contactModel.pre("save", function (next) {
    this.displayName = this.firstName + " " + this.lastName;
    this.displayName = this.displayName.trim();

    next();
});

module.exports = mongoose.model("Contact", contactModel);
