import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Target, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';

const JobMatches = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState('');
    const [matchingJobId, setMatchingJobId] = useState(null);
    const [matchResults, setMatchResults] = useState({});

    useEffect(() => {
        fetchJobs();
        fetchResumes();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs');
            setJobs(res.data);
        } catch (error) {
            console.error('Failed to load jobs', error);
        }
    };

    const fetchResumes = async () => {
        try {
            const res = await api.get('/resume/my-resumes');
            setResumes(res.data);
            if (res.data.length > 0) {
                // By default select the most recent resume (first in list)
                setSelectedResume(res.data[0].id.toString());
            }
        } catch (err) {
            console.error("Failed to load resumes", err);
        }
    };

    const handleMatchJob = async (jobId) => {
        if (!selectedResume) {
            alert('Please upload/select a resume first.');
            return;
        }

        setMatchingJobId(jobId);

        // Mock extracted skills - in a real app, we would fetch the stored skills for the selected resume
        // For this demo, we assume the resume has these skills for matching purposes, or we would pass the actual skills DB column
        const dummyResumeSkills = ["React", "JavaScript", "HTML", "CSS", "Node.js", "Express", "Tailwind CSS"];

        try {
            const res = await api.post(`/match/${jobId}`, {
                resumeSkills: dummyResumeSkills
            });

            setMatchResults(prev => ({
                ...prev,
                [jobId]: res.data.analysis
            }));
        } catch (error) {
            console.error('Failed to calculate match', error);
            alert('Failed to calculate AI match');
        } finally {
            setMatchingJobId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Target className="text-indigo-600 w-8 h-8" /> Find Your Match
                    </h1>
                    <p className="text-gray-500 mt-1">See how well your resume fits open roles</p>
                </div>

                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Analyze Using Resume</label>
                    <select
                        value={selectedResume}
                        onChange={(e) => setSelectedResume(e.target.value)}
                        className="bg-transparent font-medium outline-none text-indigo-700 w-full"
                    >
                        <option value="" disabled>Select a resume...</option>
                        {resumes.map(r => (
                            <option key={r.id} value={r.id}>
                                Document #{r.id} (ATS: {r.ats_score || 'N/A'})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {jobs.map(job => {
                    const match = matchResults[job.id];
                    const isMatching = matchingJobId === job.id;

                    return (
                        <div key={job.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:-translate-y-1 transition duration-300 flex flex-col h-full">
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                    <span className="text-green-700 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">{job.salary_range}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{job.description}</p>

                                <div className="mb-6">
                                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Required Skills</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {job.skills_required && Array.isArray(job.skills_required) && job.skills_required.map((skill, idx) => (
                                            <span key={idx} className="bg-gray-100 text-gray-600 border border-gray-200 text-xs px-2 py-0.5 rounded-md">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Match Section */}
                            <div className="bg-gray-50 p-6 border-t border-gray-100">
                                {match ? (
                                    <div className="animate-fade-in space-y-4">
                                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                                            <div>
                                                <div className="text-sm font-bold text-gray-500 mb-1">AI Match Score</div>
                                                <div className="text-3xl font-black text-indigo-600">{match.matchPercentage}%</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-gray-500 mb-1">Recommendation</div>
                                                <div className={`text-lg font-black uppercase ${match.finalRecommendation.toLowerCase().includes('hire') ? 'text-green-600' : 'text-orange-500'}`}>
                                                    {match.finalRecommendation}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-700 italic border-l-4 border-indigo-300 pl-3 py-1 bg-white ml-1">
                                            "{match.shortReasoning}"
                                        </p>

                                        {match.missingSkills && match.missingSkills.length > 0 && (
                                            <div className="mt-3">
                                                <span className="text-xs font-bold text-red-600 flex items-center gap-1 mb-1.5">
                                                    <AlertTriangle className="w-3 h-3" /> Missing from your profile:
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {match.missingSkills.map((s, i) => (
                                                        <span key={i} className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleMatchJob(job.id)}
                                        disabled={isMatching}
                                        className={`w-full font-bold py-3 pr-4 pl-6 rounded-xl flex items-center justify-between transition ${isMatching ? 'bg-indigo-100 text-indigo-400 cursor-wait' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white'
                                            }`}
                                    >
                                        <span>{isMatching ? 'Analyzing Fit...' : 'Calculate AI Match Score'}</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {jobs.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <h3 className="text-xl font-bold">No jobs posted yet.</h3>
                    <p>Check back later when employers have added open positions.</p>
                </div>
            )}
        </div>
    );
};

export default JobMatches;
