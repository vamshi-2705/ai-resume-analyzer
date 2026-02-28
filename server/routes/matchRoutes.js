const express = require('express');
const router = express.Router();
const { calculateMatch } = require('../controllers/matchController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/:jobId', protect, calculateMatch);

module.exports = router;
