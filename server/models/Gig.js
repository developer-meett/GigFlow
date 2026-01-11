const mongoose = require('mongoose');

const GigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, default: 'open' }, // open, in-progress, completed
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // --- ADD THIS SECTION ---
  proposals: [{
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    freelancerName: { type: String }, // Saving name directly is easier for display
    price: { type: Number, required: true },
    coverLetter: { type: String, required: true }
  }]
  // ------------------------

}, { timestamps: true });

module.exports = mongoose.model('Gig', GigSchema);