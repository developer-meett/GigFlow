import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const MyGigs = () => {
  const [myGigs, setMyGigs] = useState([]);
  const [selectedGigBids, setSelectedGigBids] = useState([]);
  const [activeGigId, setActiveGigId] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch all gigs created by current user
  useEffect(() => {
    const fetchMyGigs = async () => {
      try {
        const res = await axios.get(`/gigs?ownerId=${user.id}`);
        setMyGigs(res.data);
      } catch (err) {
        console.error("Error fetching my gigs", err);
      }
    };
    if (user) fetchMyGigs();
  }, [user]);

  // Fetch bids when "View Bids" is clicked
  const handleViewBids = async (gigId) => {
    try {
      setActiveGigId(gigId);
      const res = await axios.get(`/bids/${gigId}`);
      setSelectedGigBids(res.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to load bids';
      alert(errorMsg);
    }
  };

  // Hire Functionality
  const handleHire = async (bidId) => {
    if(!window.confirm("Are you sure you want to hire this freelancer?")) return;
    try {
      await axios.patch(`/bids/${bidId}/hire`);
      alert("Freelancer hired successfully!");
      handleViewBids(activeGigId);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to hire freelancer';
      alert(errorMsg);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your job postings and review proposals</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: MY GIGS LIST */}
          <div className="bg-white shadow-sm rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">My Posted Jobs</h2>
            {myGigs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't posted any jobs yet.</p>
              </div>
            )}
            
            <div className="space-y-3">
              {myGigs.map(gig => (
                <div 
                  key={gig._id} 
                  className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    activeGigId === gig._id 
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleViewBids(gig._id)}
                >
                  <h3 className="font-bold text-gray-900 mb-3">{gig.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      gig.status === 'open' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {gig.status.toUpperCase()}
                    </span>
                    <span className="text-emerald-600 font-medium text-sm flex items-center gap-1">
                      View Proposals
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: BIDS FOR SELECTED GIG */}
          <div className="bg-white shadow-sm rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {activeGigId ? "Proposals Received" : "Select a Job"}
            </h2>
            
            {!activeGigId && (
              <div className="text-center py-12">
                <p className="text-gray-500">Click on a job to view submitted proposals</p>
              </div>
            )}
            
            {activeGigId && selectedGigBids.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No proposals received yet</p>
              </div>
            )}

            <div className="space-y-4">
              {selectedGigBids.map(bid => (
                <div key={bid._id} className="border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900 mb-2">{bid.freelancerId?.name || "Freelancer"}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">{bid.message}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-500 mb-1">Bid Amount</p>
                      <div className="text-2xl font-bold text-gray-900 mb-3">${bid.price}</div>
                      
                      {bid.status === 'pending' && (
                         <button 
                           onClick={() => handleHire(bid._id)}
                           className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium transition shadow-sm"
                         >
                           Hire Now
                         </button>
                      )}
                      {bid.status === 'hired' && (
                        <span className="inline-block px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-semibold text-sm">Hired</span>
                      )}
                      {bid.status === 'rejected' && (
                        <span className="inline-block px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold text-sm">Declined</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGigs;