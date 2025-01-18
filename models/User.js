const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "username is required"],
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: 3,
  },
});
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.getJwt = function () {
  const token = jwt.sign({ name: this.name, userId: this._id }, "jwtSecret", {
    expiresIn: "30d",
  });
  return token;
};
userSchema.methods.comparePasswords = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};
module.exports = mongoose.model("User", userSchema);
