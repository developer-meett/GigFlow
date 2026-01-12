const express = require('express');
const { createBid, getBidsByGig, hireFreelancer } = require('../controllers/bidController');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

// Route: POST /api/bids (Submit a bid)
router.post('/', verifyToken, createBid);

// Route: GET /api/bids/:gigId (View bids for a gig)
router.get('/:gigId', verifyToken, getBidsByGig);

// Route: PATCH /api/bids/:bidId/hire (Hire a freelancer)
router.patch('/:bidId/hire', verifyToken, hireFreelancer);

module.exports = router;