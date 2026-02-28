import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md border-b border-gray-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 text-indigo-600 font-bold text-xl tracking-tight">
                    <Briefcase className="w-6 h-6" />
                    <span>AI Resume Match</span>
                </Link>

                <div className="flex items-center space-x-6 text-sm font-medium text-gray-600">
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <Link to="/admin" className="hover:text-indigo-600 transition-colors">Admin Dashboard</Link>
                            ) : (
                                <>
                                    <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">My Resume</Link>
                                    <Link to="/matches" className="hover:text-indigo-600 transition-colors">Job Matches</Link>
                                </>
                            )}

                            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                                <span className="flex items-center space-x-2 text-gray-800">
                                    <User className="w-4 h-4" />
                                    <span>{user.name}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-indigo-600 transition-colors">Login</Link>
                            <Link
                                to="/register"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
