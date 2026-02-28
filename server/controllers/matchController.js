const { pool } = require('../config/db');
const { matchJob } = require('../services/aiService');

// @desc    Match resume against a specific job
// @route   POST /api/match/:jobId
// @access  Private
const calculateMatch = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { resumeSkills } = req.body; // e.g., ["React", "Node", "PostgreSQL"]

        if (!resumeSkills || !Array.isArray(resumeSkills)) {
            return res.status(400).json({ error: 'Please provide array of resumeSkills in the request body' });
        }

        // 1. Get Job Description
        const jobResult = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
        if (jobResult.rows.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const job = jobResult.rows[0];

        // 2. Format Job Info for Prompt
        const jobInfo = `
        Title: ${job.title}
        Description: ${job.description}
        Required Skills: ${JSON.stringify(job.skills_required)}
        `;

        // 3. Call AI Match Service
        const matchResult = await matchJob(resumeSkills, jobInfo);

        // 4. Save match result to Database
        const dbResult = await pool.query(
            'INSERT INTO matches (user_id, job_id, match_score, missing_skills) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, jobId, matchResult.matchPercentage || 0, JSON.stringify(matchResult.missingSkills || [])]
        );

        res.json({
            message: 'Match calculated successfully',
            dbRecord: dbResult.rows[0],
            analysis: matchResult
        });
    } catch (error) {
        console.error('Error in calculateMatch:', error);
        res.status(500).json({ error: 'Server error during job matching' });
    }
};

module.exports = {
    calculateMatch
};
