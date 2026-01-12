const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });
// Indexes for better query performance
userSchema.index({ email: 1 });
module.exports = mongoose.model('User', userSchema);