const Gig = require('../models/Gig');
const User = require('../models/User');

// Create a new gig (job posting)
exports.createGig = async (req, res) => {
  try {
    const { title, description, budget, deadline } = req.body;
    
    // Validation
    if (!title || !description || !budget) {
      return res.status(400).json({ message: "Title, description, and budget are required" });
    }
    
    if (budget <= 0) {
      return res.status(400).json({ message: "Budget must be greater than 0" });
    }
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const newGig = new Gig({
      title: title.trim(),
      description: description.trim(),
      budget: Number(budget),
      deadline: deadline || null,
      owner: req.user.id
    });

    const gig = await newGig.save();
    const populatedGig = await Gig.findById(gig._id).populate('owner', 'name');
    res.status(201).json(populatedGig);
  } catch (err) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get all gigs with optional search and owner filter
exports.getAllGigs = async (req, res) => {
  try {
    const { search, ownerId } = req.query;
    
    let query = {};
    
    // Filter by owner if specified (for dashboard)
    if (ownerId) {
      query.owner = ownerId;
    } else {
      // Show only open gigs for public feed
      query.status = 'open';
    }

    // Add search filter if provided
    if (search) {
      query.title = { $regex: search, $options: 'i' }; 
    }

    const gigs = await Gig.find(query)
      .populate('owner', 'name')
      .sort({ createdAt: -1 });
      
    res.json(gigs);
  } catch (err) {
    console.error("Get All Gigs Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get single gig by ID with owner details
exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('owner', 'name');
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    res.json(gig);
  } catch (err) {
    console.error("Get Gig By ID Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};