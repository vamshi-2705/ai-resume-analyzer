const { GoogleGenerativeAI } = require('@google/generative-ai');

// Assume we are using Gemini API as provided in the instructions
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_if_not_set');

const analyzeResume = async (resumeText) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are an ATS (Applicant Tracking System) and professional HR recruiter.
        Analyze the following resume text:
        
        ${resumeText}
        
        Return ONLY in strictly valid JSON format, with no markdown code blocks formatting, containing exactly the following structure:
        {
          "atsScore": 0-100 number,
          "extractedSkills": ["skill1", "skill2"],
          "missingSkills": ["missing_skill1", "missing_skill2"],
          "improvements": ["suggestion1", "suggestion2"],
          "professionalSummary": "rewritten summary",
          "strengths": ["strength1"],
          "weaknesses": ["weakness1"]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown markers if Gemini returned them
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw new Error("Failed to analyze resume with AI.");
    }
};

const matchJob = async (resumeSkills, jobDescription) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are an AI recruitment assistant.
        
        Resume Skills:
        ${JSON.stringify(resumeSkills)}
        
        Job Description:
        ${jobDescription}
        
        Return ONLY in strictly valid JSON format, with no markdown code blocks formatting:
        {
          "matchPercentage": 0-100 number,
          "missingSkills": ["skill1", "skill2"],
          "matchingSkills": ["skill1", "skill2"],
          "finalRecommendation": "Hire / Reject / Interview",
          "shortReasoning": "1-2 sentence reason"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("AI Match Error:", error);
        throw new Error("Failed to match job with AI.");
    }
};

module.exports = { analyzeResume, matchJob };
