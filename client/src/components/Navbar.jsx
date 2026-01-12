import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      dispatch({ type: "LOGOUT" });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-400">GigFlow</Link>
        
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-300">Browse Gigs</Link>
          
          {user ? (
            <>
              {/* Fixes Issue #1: Link to Post Gig */}
              <Link to="/add" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                + Post Gig
              </Link>
              
              {/* Fixes Issue #2: Link to Dashboard */}
              <Link to="/dashboard" className="hover:text-blue-300">
                My Dashboard
              </Link>
              
              <span className="text-gray-400">Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="bg-white text-black px-4 py-2 rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;