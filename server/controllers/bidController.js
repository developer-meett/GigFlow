const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

// Submit a bid on a gig
exports.createBid = async (req, res) => {
  try {
    const { gigId, price, message } = req.body;
    
    // Validation
    if (!gigId || !price || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    if (price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    
    if (gig.status !== 'open') {
      return res.status(400).json({ message: "This gig is no longer accepting bids" });
    }

    if (gig.owner.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot bid on your own gig" });
    }

    const existingBid = await Bid.findOne({ gigId, freelancerId: req.user.id });
    if (existingBid) {
      return res.status(400).json({ message: "You have already placed a bid on this gig" });
    }

    const newBid = new Bid({
      gigId,
      freelancerId: req.user.id,
      price: Number(price),
      message: message.trim(),
    });
    
    const savedBid = await newBid.save();
    const populatedBid = await Bid.findById(savedBid._id).populate('freelancerId', 'name email');
    res.status(201).json(populatedBid);
  } catch (err) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get all bids for a specific gig (owner only)
exports.getBidsByGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Owner verification
    const gigOwnerId = gig.owner.toString();
    const requestUserId = req.user.id.toString();
    
    if (gigOwnerId !== requestUserId) {
      return res.status(403).json({ message: "Access denied. Only the gig owner can view bids." });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Hire a freelancer for a gig (with transaction for data consistency)
exports.hireFreelancer = async (req, res) => {
  // Start MongoDB transaction to ensure atomic updates
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;

    // Find the bid with gig details
    const bid = await Bid.findById(bidId).populate('gigId').session(session);
    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Bid not found" });
    }

    // Verify user is the gig owner
    if (bid.gigId.owner.toString() !== req.user.id) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    // Verify gig is still open
    if (bid.gigId.status !== 'open') {
      await session.abortTransaction();
      return res.status(400).json({ message: "Gig already assigned" });
    }

    // Update the hired bid status
    bid.status = 'hired';
    await bid.save({ session });

    // Update gig status to assigned
    const gig = await Gig.findById(bid.gigId._id).session(session);
    gig.status = 'assigned';
    await gig.save({ session });

    // Reject all other bids for this gig
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bidId } },
      { status: 'rejected' },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Send real-time notification to hired freelancer
    if (global.io && global.onlineUsers) {
      const freelancerId = bid.freelancerId.toString();
      const socketId = global.onlineUsers[freelancerId];

      if (socketId) {
        global.io.to(socketId).emit("hireNotification", {
          message: `Congratulations! You have been hired for "${gig.title}"`,
          gigId: gig._id
        });
      }
    }

    res.json({ message: "Freelancer hired successfully", bid });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};