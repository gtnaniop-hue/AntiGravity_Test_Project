const express = require('express');
const { getSummary, getWeeklySummary } = require('../controllers/summaryController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/daily', protect, getSummary);
router.get('/weekly', protect, getWeeklySummary);

module.exports = router;
