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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Next Opportunity</h1>
              <p className="text-gray-600">Browse top freelance projects and start earning</p>
            </div>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search for projects..." 
                className="border border-gray-300 rounded-lg px-5 py-3 w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {gigs.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg">No projects found. Try adjusting your search.</p>
            </div>
          )}
          
          {gigs.map((gig) => (
            <div key={gig._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-emerald-600 transition">
                      {gig.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                      {gig.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Budget:</span>
                      <span className="text-lg font-bold text-gray-900">${gig.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Client:</span>
                      <span className="font-medium text-gray-800">{gig.owner?.name || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                        {gig.status === 'open' ? 'Open for proposals' : 'Closed'}
                      </span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/gigs/${gig._id}`}
                    className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;