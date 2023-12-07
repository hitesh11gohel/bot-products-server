const mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
