import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PlusCircle, Briefcase, IndianRupee, MapPin } from 'lucide-react';

const AdminDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skills_required: '',
        salary_range: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs');
            setJobs(res.data);
        } catch (error) {
            console.error('Failed to load jobs', error);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                skills_required: formData.skills_required.split(',').map(s => s.trim()).filter(Boolean)
            };
            await api.post('/jobs', payload);
            setFormData({ title: '', description: '', skills_required: '', salary_range: '' });
            setShowForm(false);
            fetchJobs();
        } catch (error) {
            console.error('Failed to create job', error);
            alert('Failed to post job');
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage job postings and platform requirements</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition shadow-sm"
                >
                    <PlusCircle className="w-5 h-5" />
                    {showForm ? 'Cancel' : 'Post New Job'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-50 mb-10 animate-fade-in">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Create Job Posting</h2>
                    <form onSubmit={handleCreateJob} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. Senior React Developer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.salary_range}
                                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. $120k - $150k"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills (comma separated)</label>
                            <input
                                type="text"
                                required
                                value={formData.skills_required}
                                onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="React, Node.js, PostgreSQL, Tailwind"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                placeholder="Describe the responsibilities and requirements..."
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium shadow-md transition"
                            >
                                Publish Job
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">Active Postings</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">{jobs.length} total</span>
                </div>

                {jobs.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No jobs posted yet. Create one above.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {jobs.map(job => (
                            <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-xl font-bold text-gray-900">{job.title}</h4>
                                    <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-md border border-green-100">
                                        {job.salary_range}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                                <div className="flex gap-2">
                                    {job.skills_required && Array.isArray(job.skills_required) && job.skills_required.map((skill, idx) => (
                                        <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
