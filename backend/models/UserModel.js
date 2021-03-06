const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    fullname: { type: String, requiredL: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    followers: [String],
    following: [String],
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model('User', userSchema);

// export default User;
module.exports = User;