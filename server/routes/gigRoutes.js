const express = require('express');
// 1. We added 'addProposal' to the imports here:
const { createGig, getAllGigs, getGigById, addProposal } = require('../controllers/gigController');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

// Public Routes
router.get('/', getAllGigs);
router.get('/:id', getGigById);

// Protected Route: Post a Gig
router.post('/', verifyToken, createGig);

// 2. NEW ROUTE: Submit a Proposal (Bid)
router.post('/:id/proposals', verifyToken, addProposal);

module.exports = router;