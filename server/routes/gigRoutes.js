const express = require('express');
const { createGig, getAllGigs, getGigById } = require('../controllers/gigController');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();


router.get('/', getAllGigs);

router.get('/:id', getGigById);


router.post('/', verifyToken, createGig);

module.exports = router;