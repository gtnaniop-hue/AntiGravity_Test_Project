const express = require('express');
const { getWeightHistory, addWeight } = require('../controllers/weightController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getWeightHistory).post(protect, addWeight);

module.exports = router;
