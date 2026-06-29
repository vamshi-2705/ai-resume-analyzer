# AI Resume Analyzer & Job Matcher

AI Resume Analyzer is a modern full-stack web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). The application parses PDF resumes, extracts skills, suggests improvements, and scores resumes dynamically. Users can optionally paste a target Job Description to get custom-tailored suggestions and compatibility scoring.

The application uses the **Groq SDK** powered by the **Llama 3.3 70B** model for lightning-fast and highly accurate JSON-structured analysis.

---

## 🚀 Features

- **PDF Resume Upload & Text Extraction**: Upload resumes in PDF format; the server parses the text automatically.
- **AI-Powered ATS Analysis**:
  - Overall ATS match score (0-100).
  - Extracted skills listed directly from the resume.
  - Identification of critical missing skills (tailored to an optional job description if provided).
  - Concrete suggestion checklist for resume improvement.
  - Rewritten professional summary tailored for recruiters.
  - List of key strengths and weaknesses.
- **Job Matching**: Paste a job description alongside a list of skills to get an instant match percentage, recommendation, and brief explanation.
- **User Dashboard & History**: Save and view your previous analysis scores and resume upload history.
- **Role-Based Portals**: Interfaces for Job Seekers and Employers/Admins.
- **Secure Authentication**: Built-in JSON Web Token (JWT) authorization and hashed password security.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State/Routing**: React Context API & React Router DOM

### Backend (Server)
- **Runtime**: Node.js & Express
- **Database**: PostgreSQL (hosted on Neon.tech)
- **AI Integration**: Groq API SDK (Model: `llama-3.3-70b-versatile`)
- **File Uploads**: Multer (in-memory storage)
- **PDF Parser**: `pdf-parse-new`
- **Security**: BCrypt.js & JSON Web Token (JWT)

---

## ⚙️ Configuration & Environment Variables

### Backend Configuration
Create a `.env` file inside the `server/` directory and configure the following variables:

```env
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
JWT_SECRET=your_jwt_secret_key_here
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### Frontend Configuration
Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```
*(For production, replace the local URL with your deployed Render server API endpoint).*

---

## 💻 Getting Started

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **PostgreSQL Database** (e.g., Neon.tech free instance)
- **Groq API Key** (Get one from [Groq Console](https://console.groq.com/))

### 2. Installation & Setup

#### Clone the repository:
```bash
git clone https://github.com/vamshi-2705/ai-resume-analyzer.git
cd ai-resume-analyzer
```

#### Set up the Server:
```bash
cd server
npm install
# Initialize the database tables
node config/init_db.js
# Start development server
npm run dev
```

#### Set up the Client:
```bash
cd ../client
npm install
# Start Vite development server
npm run dev
```

The application will be accessible at `http://localhost:5173` locally, communicating with the backend running on `http://localhost:5000`.

---

## ☁️ Deployment

### 1. Database (Neon.tech)
- Create a free project on Neon.tech.
- Copy your connection string and use it as `DATABASE_URL` in the environment variables.

### 2. Backend (Render)
- Connect your GitHub repository to Render and create a new **Web Service**.
- Build Command: `npm install`
- Start Command: `npm start` (this runs `node config/init_db.js && node server.js` to ensure tables are always created on startup).
- Add Environment Variables in the **Environment** tab:
  - `DATABASE_URL` (Neon Postgres String)
  - `GROQ_API_KEY` (Groq API Key)
  - `JWT_SECRET` (A strong random string)

### 3. Frontend (Vercel)
- Deploy the `client/` directory as a new project on Vercel.
- Configure the environment variable:
  - `VITE_API_URL=https://your-render-backend-url.onrender.com/api`
