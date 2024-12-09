const mongoose = require('mongoose');
const crypto = require("crypto");
const { createUserToken } = require('../service/authentication');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required:[true, 'Email field is required'],
    unique: true
  },
  salt: {
    type: String,
  },
  password: {
    type: String,
    required:[true, 'Password fields is required'],
    minlength: [6, 'atleast 6 characters required']
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
  }
}, { timestamps: true });

// Hash the user's password before saving
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = crypto.randomBytes(16).toString('hex'); // Generate a unique salt
  const hashedPassword = crypto.createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');

  user.salt = salt;
  user.password = hashedPassword;

  next();
});

// Static method to match passwords
userSchema.statics.matchPassGenToken = async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  const hashedInputPassword = crypto.createHmac('sha256', user.salt)
    .update(password) // Hash the input password
    .digest('hex');

  if (user.password !== hashedInputPassword) {
    throw new Error("Incorrect password");
  }

  const token = createUserToken(user);
  return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
