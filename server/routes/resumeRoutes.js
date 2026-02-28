const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume, getMyResumes } = require('../controllers/resumeController');
const { protect } = require('../middlewares/authMiddleware');

// Set up Multer to store file in memory so we can parse it directly
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

router.post('/upload', protect, (req, res, next) => {
    upload.single('resume')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: `File upload error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, uploadResume);
router.get('/my-resumes', protect, getMyResumes);

module.exports = router;
