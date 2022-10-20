const mongoose = require("mongoose");
const createError = require("http-errors");

const contactSchema = new mongoose.Schema(
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

contactSchema.pre("save", function (next) {
    this.firstName = this.firstName ? this.firstName : "";
    this.lastName = this.lastName ? this.lastName : "";
    this.displayName = this.firstName + " " + this.lastName;
    this.displayName = this.displayName.trim();
    next();
});

module.exports = mongoose.model("Contact", contactSchema);
