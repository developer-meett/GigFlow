const mongoose = require('mongoose');

const GigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Date, // Fix: Added this field explicitly
    required: false, // Fix: Set to false so it doesn't crash if empty
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'assigned'],
    default: 'open',
  },
  // We can store proposal IDs here for faster access, 
  // or just query the Bid model (which is what we are doing in the controllers).
}, { timestamps: true });

// Indexes for better query performance
GigSchema.index({ owner: 1 });
GigSchema.index({ status: 1 });
GigSchema.index({ createdAt: -1 });
GigSchema.index({ title: 'text' }); // Text search index

module.exports = mongoose.model('Gig', GigSchema);