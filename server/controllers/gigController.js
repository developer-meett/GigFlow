const Gig = require('../models/Gig');

// 1. Create a new Gig
exports.createGig = async (req, res) => {
  try {
    const { title, description, budget, deadline } = req.body;
    
    const newGig = new Gig({
      title,
      description,
      budget,
      deadline,
      owner: req.user.id // Taken from the token (the logged-in user)
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
    // Populate 'owner' to get the name of the person who posted it
    const gigs = await Gig.find({ status: 'open' }).populate('owner', 'name').sort({ createdAt: -1 });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Get Single Gig Details
exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('owner', 'name email');
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};