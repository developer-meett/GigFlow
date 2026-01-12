const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  gigId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gig', 
    required: true 
  },
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'hired', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

// Indexes for better query performance
bidSchema.index({ gigId: 1 });
bidSchema.index({ freelancerId: 1 });
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true }); // Prevent duplicate bids
bidSchema.index({ status: 1 });

module.exports = mongoose.model('Bid', bidSchema);