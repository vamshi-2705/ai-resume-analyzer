import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Cpu, Briefcase, Zap } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center pt-20 px-4">
            <div className="text-center max-w-3xl mb-16">
                <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 drop-shadow-sm">
                    AI-Powered Resume Analysis & Job Matching
                </h1>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                    Upload your resume and let our advanced AI analyze your skills, provide exact ATS scoring, and match you with your dream job in seconds.
                </p>
                <div className="flex space-x-4 justify-center">
                    <Link to="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-1">
                        Get Started Free
                    </Link>
                    <Link to="/login" className="px-8 py-4 bg-white text-indigo-600 font-bold border-2 border-indigo-100 hover:border-indigo-600 rounded-xl transition hover:-translate-y-1 shadow-sm">
                        Login
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100 hover:-translate-y-2 transition duration-300">
                    <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-xl mb-6 text-indigo-600">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Upload & Extract</h3>
                    <p className="text-gray-600">Securely upload your PDF resume. We instantly parse out your skills, experience, and key metrics.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-purple-100/50 border border-gray-100 hover:-translate-y-2 transition duration-300">
                    <div className="bg-purple-100 w-16 h-16 flex items-center justify-center rounded-xl mb-6 text-purple-600">
                        <Cpu className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">AI Analysis</h3>
                    <p className="text-gray-600">Get a professional ATS score along with actionable feedback on missing skills and summary improvements.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-pink-100/50 border border-gray-100 hover:-translate-y-2 transition duration-300">
                    <div className="bg-pink-100 w-16 h-16 flex items-center justify-center rounded-xl mb-6 text-pink-600">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Instant Match</h3>
                    <p className="text-gray-600">We compare your exact skill profile against open positions, generating ranked matches with detailed reasoning.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
