const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    },
    imgUrl: String,
    verified: {
      type: Boolean,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userModel);
