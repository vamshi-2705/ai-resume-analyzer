const { pool } = require('../config/db');

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res) => {
    try {
        const { title, description, skills_required, salary_range } = req.body;

        if (!title || !description || !skills_required) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const newJob = await pool.query(
            'INSERT INTO jobs (title, description, skills_required, salary_range) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, JSON.stringify(skills_required), salary_range]
        );

        res.status(201).json(newJob.rows[0]);
    } catch (error) {
        console.error('Error in createJob:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const jobs = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
        res.json(jobs.rows);
    } catch (error) {
        console.error('Error in getJobs:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createJob,
    getJobs
};
