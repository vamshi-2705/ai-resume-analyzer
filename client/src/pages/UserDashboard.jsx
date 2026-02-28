import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { UploadCloud, File, CheckCircle, AlertTriangle, Briefcase, Zap, Cpu } from 'lucide-react';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await api.get('/resume/my-resumes');
                setResumes(res.data);
            } catch (err) {
                console.error("Failed to load resumes", err);
            }
        };
        fetchResumes();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a PDF file first.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        setUploading(true);
        setError('');

        try {
            const res = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAnalysis(res.data.analysis);
            setResumes([res.data.resumeRecord, ...resumes]);
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload and analyze resume.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <UploadCloud className="text-indigo-600 w-6 h-6" /> Upload Resume
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {error}
                            </div>
                        )}

                        <form onSubmit={handleUpload}>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="bg-indigo-50 p-3 rounded-full">
                                        <File className="w-8 h-8 text-indigo-500" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {file ? <span className="font-semibold text-indigo-600">{file.name}</span> : 'Click or drag PDF to upload'}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={uploading || !file}
                                className={`mt-4 w-full font-bold py-3 px-4 rounded-xl transition shadow-sm ${uploading ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
                            >
                                {uploading ? 'Analyzing with AI...' : 'Analyze Resume'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Briefcase className="text-gray-600 w-5 h-5" /> Recent Resumes
                        </h2>
                        {resumes.length === 0 ? (
                            <p className="text-gray-500 text-sm">No resumes uploaded yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {resumes.map(r => (
                                    <div key={r.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                                        <div className="text-sm font-medium text-gray-700 truncate w-32">Document #{r.id}</div>
                                        <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-md flex items-center gap-1">
                                            <Zap className="w-3 h-3" /> ATS: {r.ats_score}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Analysis Results Section */}
                <div className="lg:col-span-2 space-y-6">
                    {analysis ? (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <CheckCircle className="w-32 h-32 text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-bold mb-6 text-gray-900">AI Analysis Results</h2>

                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-32 h-32 rounded-full border-8 border-indigo-100 flex items-center justify-center relative">
                                        <svg className="absolute w-full h-full transform -rotate-90">
                                            <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-indigo-100" />
                                            <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="339" strokeDashoffset={339 - (339 * analysis.atsScore) / 100} className="text-indigo-600" />
                                        </svg>
                                        <div className="text-center">
                                            <span className="text-3xl font-black text-indigo-600">{analysis.atsScore}</span>
                                            <span className="text-xs text-gray-500 block">ATS Score</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Professional Summary Rewrite</h3>
                                        <p className="text-gray-700 italic border-l-4 border-indigo-500 pl-4 py-1">{analysis.professionalSummary}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-bold text-green-700 flex items-center gap-2 mb-3">
                                            <CheckCircle className="w-5 h-5" /> Extracted Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.extractedSkills?.map((s, i) => (
                                                <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-red-700 flex items-center gap-2 mb-3">
                                            <AlertTriangle className="w-5 h-5" /> Missing Skills (In-Demand)
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.missingSkills?.map((s, i) => (
                                                <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100 grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-3">Strengths</h3>
                                        <ul className="space-y-2">
                                            {analysis.strengths?.map((s, i) => (
                                                <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                                                    <span className="text-green-500 mt-0.5">•</span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-3">Improvement Suggestions</h3>
                                        <ul className="space-y-2">
                                            {analysis.improvements?.map((s, i) => (
                                                <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                                                    <span className="text-indigo-500 mt-0.5">→</span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-2xl border border-gray-100 border-dashed flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                            <div className="bg-gray-50 p-6 rounded-full mb-4">
                                <Cpu className="w-12 h-12 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-400 mb-2">No Analysis Yet</h3>
                            <p className="text-gray-400 max-w-sm">Upload a PDF resume from the left panel to receive AI-powered feedback, ATS scoring, and improvements.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
