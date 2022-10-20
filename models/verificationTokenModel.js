const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  _memId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    index: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: {
      expires: 300000, //ms
    },
  },
});

module.exports = mongoose.model("verificationToken", tokenSchema);
