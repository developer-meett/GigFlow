const Gig = require('../models/Gig');
const User = require('../models/User'); // <--- CRITICAL IMPORT (This was likely missing)

// 1. Create a new Gig
exports.createGig = async (req, res) => {
  try {
    const { title, description, budget, deadline } = req.body;
    
    const newGig = new Gig({
      title,
      description,
      budget,
      deadline,
      owner: req.user.id
    });

    const gig = await newGig.save();
    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Get All Gigs (Open ones)
exports.getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ status: 'open' }).populate('owner', 'name').sort({ createdAt: -1 });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Get Single Gig Details
exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('owner', 'name email').populate('proposals.freelancerId', 'name');
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 4. Add a Proposal (Bid)
exports.addProposal = async (req, res) => {
  try {
    const { price, coverLetter } = req.body;
    
    // A. Find Gig
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // B. Prevent Self-Bidding
    if (gig.owner.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot bid on your own gig" });
    }

    // C. Find User (to get the name)
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // D. Add to Proposals Array
    gig.proposals.push({
      freelancerId: user._id,
      freelancerName: user.name,
      price,
      coverLetter
    });

    await gig.save();
    res.status(201).json(gig);

  } catch (err) {
    console.error("❌ PROPOSAL ERROR:", err); // Prints actual error to terminal
    res.status(500).json({ message: "Server Error" });
  }
};