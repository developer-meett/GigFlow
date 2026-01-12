import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState(""); // State for search text

  // Function to fetch gigs (optionally with a search query)
  const fetchGigs = async (query = "") => {
    try {
      // If query exists, URL becomes /gigs?search=react
      const url = query ? `/gigs?search=${query}` : '/gigs';
      const res = await axios.get(url);
      setGigs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Initial Load (Fetch all)
  useEffect(() => {
    fetchGigs();
  }, []);

  // Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs(search); // Call API with search term
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      
      {/* 🔍 SEARCH BAR SECTION */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Latest Gigs</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search gigs..." 
            className="border border-gray-300 rounded px-4 py-2 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* GIGS LIST */}
      <div className="grid gap-6">
        {gigs.length === 0 && <p className="text-gray-500">No gigs found.</p>}
        
        {gigs.map((gig) => (
          <div key={gig._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-2">{gig.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gig.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>💰 Budget: ${gig.budget}</span>
                  <span>👤 {gig.owner?.name || "Unknown"}</span>
                </div>
              </div>
              <Link 
                to={`/gigs/${gig._id}`}
                className="bg-gray-900 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gray-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;