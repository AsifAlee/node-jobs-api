const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = await user.getJwt();

  res.status(StatusCodes.CREATED).json({ user, token });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("User not found");
  }
  console.log(user);
  const isPasswordMatch = await user.comparePasswords(password);
  if (isPasswordMatch) {
    res.status(StatusCodes.OK).json({ user, token: user.getJwt() });
  } else {
    throw new BadRequestError("Invalid email or password");
  }
};

module.exports = { register, login };
