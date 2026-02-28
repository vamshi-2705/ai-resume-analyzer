const express = require('express');
const router = express.Router();
const { createJob, getJobs } = require('../controllers/jobController');
const { protect, adminData } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getJobs)
    .post(protect, adminData, createJob);

module.exports = router;
