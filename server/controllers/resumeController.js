const { pool } = require('../config/db');
const { extractTextFromPDF } = require('../utils/pdfParser');
const { analyzeResume } = require('../services/aiService');

// @desc    Upload & analyze resume
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a PDF file' });
        }

        let text = '';
        try {
            // 1. Extract text from uploaded PDF
            text = await extractTextFromPDF(req.file.buffer);
        } catch (pdfError) {
            return res.status(400).json({
                error: 'Could not read text from this PDF. Ensure it is a valid text-based PDF, not an image or corrupted file.'
            });
        }

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Could not extract text from the PDF. It might be an image-only PDF.' });
        }

        // 2. Call AI Service to analyze
        const aiAnalysis = await analyzeResume(text);

        // 3. Save resume basic info to DB
        // Since we are not uploading to a real cloud storage like S3 in this setup, 
        // we will just store a dummy URL or local path. But we do want to store the score.
        const fileUrl = `/uploads/${req.file.originalname}`; // Dummy or Local URL

        const dbResult = await pool.query(
            'INSERT INTO resumes (user_id, file_url, ats_score) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, fileUrl, aiAnalysis.atsScore]
        );

        res.status(201).json({
            message: 'Resume analyzed successfully',
            resumeRecord: dbResult.rows[0],
            analysis: aiAnalysis,
            extractedTextSnippet: text.substring(0, 200) + '...' // For debugging/display
        });
    } catch (error) {
        console.error('Error in uploadResume:', error);
        res.status(500).json({ error: 'Server error during resume analysis' });
    }
};

// @desc    Get current user's resumes
// @route   GET /api/resume/my-resumes
// @access  Private
const getMyResumes = async (req, res) => {
    try {
        const resumes = await pool.query('SELECT * FROM resumes WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(resumes.rows);
    } catch (error) {
        console.error('Error in getMyResumes:', error);
        res.status(500).json({ error: 'Server error retrieving resumes' });
    }
};

module.exports = {
    uploadResume,
    getMyResumes
};
