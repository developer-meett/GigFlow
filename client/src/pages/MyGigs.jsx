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
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">My Client Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT: MY GIGS LIST */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">My Posted Jobs</h2>
          {myGigs.length === 0 && <p>You haven't posted any gigs yet.</p>}
          
          <div className="space-y-4">
            {myGigs.map(gig => (
              <div key={gig._id} className={`p-4 border rounded cursor-pointer ${activeGigId === gig._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                   onClick={() => handleViewBids(gig._id)}>
                <h3 className="font-bold">{gig.title}</h3>
                <div className="flex justify-between text-sm mt-2">
                  <span className={`px-2 py-1 rounded ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-200'}`}>
                    {gig.status.toUpperCase()}
                  </span>
                  <span className="text-blue-600 font-semibold">View Bids →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: BIDS FOR SELECTED GIG */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            {activeGigId ? "Review Proposals" : "Select a Gig to View Bids"}
          </h2>
          
          {!activeGigId && <p className="text-gray-500">Click on a job on the left to see who applied.</p>}
          
          {activeGigId && selectedGigBids.length === 0 && (
            <p className="text-gray-500">No bids received for this gig yet.</p>
          )}

          <div className="space-y-4">
            {selectedGigBids.map(bid => (
              <div key={bid._id} className="border p-4 rounded bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">{bid.freelancerId?.name || "Freelancer"}</h4>
                    <p className="text-gray-600 text-sm">{bid.message}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">${bid.price}</div>
                    
                    {/* HIRE BUTTON LOGIC */}
                    {bid.status === 'pending' && (
                       <button 
                         onClick={() => handleHire(bid._id)}
                         className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                       >
                         HIRE NOW
                       </button>
                    )}
                    {bid.status === 'hired' && <span className="block mt-2 text-green-600 font-bold">HIRED</span>}
                    {bid.status === 'rejected' && <span className="block mt-2 text-red-400 font-bold">REJECTED</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGigs;