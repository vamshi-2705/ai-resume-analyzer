const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool, testConnection } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Base route to check if server is running
app.get('/', (req, res) => {
    res.send('AI Resume Analyzer API is running successfully!');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await testConnection();
});
