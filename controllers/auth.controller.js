const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  const hashedPassword = await argon2.hash(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user
  });
});

module.exports = {
  register,
  login,
  getMe
};