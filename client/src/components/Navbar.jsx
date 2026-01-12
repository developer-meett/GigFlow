import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// Note: We don't need axios here anymore because AuthContext handles it

const Navbar = () => {
  // 👇 FIX: Get 'logout' instead of 'dispatch'
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 👇 FIX: Use the bulletproof logout function we made earlier
      await logout(); 
      // navigate is handled inside logout usually, but safe to keep here too
      navigate('/');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition">
          GigFlow
        </Link>
        
        <div className="flex gap-8 items-center">
          <Link to="/" className="text-gray-700 hover:text-emerald-600 font-medium transition">
            Find Work
          </Link>
          
          {user ? (
            <>
              {/* Only show 'Post a Job' if user is a Seller (Optional check) */}
              <Link to="/add" className="text-gray-700 hover:text-emerald-600 font-medium transition">
                Post a Job
              </Link>
              
              <Link to="/orders" className="text-gray-700 hover:text-emerald-600 font-medium transition">
                Orders
              </Link>
              
              <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                    {/* Safe check in case name is missing */}
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                    {user.email && <span className="text-xs text-gray-500">{user.email}</span>}
                  </div>
                </div>
                
                {/* 👇 LOGOUT BUTTON (Fixed) */}
                <button 
                  onClick={handleLogout} 
                  className="ml-2 px-4 py-2 text-sm text-gray-600 hover:text-white hover:bg-red-500 border border-gray-300 hover:border-red-500 rounded-lg font-medium transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-emerald-600 font-medium transition">
                Log In
              </Link>
              <Link to="/register" className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-emerald-700 transition shadow-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;