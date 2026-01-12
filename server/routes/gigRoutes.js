const express = require('express');
const router = express.Router();

// FIX: Pointing exactly to 'verifyToken' (case-sensitive)
const { verifyToken } = require('../middleware/verifyToken'); 

const { 
  getAllGigs, 
  getGigById, 
  createGig 
} = require('../controllers/gigController');

// 1. Get all gigs (Public)
router.get('/', getAllGigs);

// 2. Get single gig details (Public)
router.get('/:id', getGigById);

// 3. Create a gig (Protected)
// This was likely the line causing the error because 'verifyToken' was undefined
router.post('/', verifyToken, createGig);

module.exports = router;