import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const GigDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  
  const [bidPrice, setBidPrice] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [message, setMessage] = useState('');

  // Fetch gig details and bids if user is owner
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await axios.get(`/gigs/${id}`);
        setGig(res.data);
        
        // If current user owns this gig, fetch the bids
        if (user && res.data.owner?._id === user.id) {
          fetchBids();
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchGig();
  }, [id, user]);

  // Fetch all bids for this gig (owner only)
  const fetchBids = async () => {
    try {
      const res = await axios.get(`/bids/${id}`);
      setBids(res.data);
    } catch (err) {
      console.error("Could not fetch bids", err);
    }
  };

  // Submit a bid as freelancer
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/bids', {
        gigId: id,
        price: bidPrice,
        message: bidMessage
      });
      setMessage('Bid placed successfully!');
      setBidPrice('');
      setBidMessage('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error placing bid');
    }
  };

  // Hire a freelancer (owner only)
  const handleHire = async (bidId) => {
    try {
      await axios.patch(`/bids/${bidId}/hire`);
      setMessage('Freelancer Hired! Gig is now closed.');
      const gigRes = await axios.get(`/gigs/${id}`);
      setGig(gigRes.data);
      fetchBids();
    } catch (err) {
      setMessage('Error hiring freelancer');
    }
  };

  if (!gig) return <div className="p-8">Loading...</div>;

  // FIX: Added safety check here too
  const isOwner = user && gig.owner && user.id === gig.owner._id;
  const isGigOpen = gig.status === 'open';

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Gig Header */}
        <div className="bg-white shadow-sm rounded-xl p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{gig.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>Posted by <span className="font-semibold text-gray-800">{gig.owner ? gig.owner.name : "Anonymous"}</span></span>
                <span className="text-gray-400">•</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isGigOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {gig.status === 'open' ? 'Accepting proposals' : 'Closed'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Budget</p>
              <p className="text-3xl font-bold text-gray-900">${gig.budget}</p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Project Description</h3>
            <p className="text-gray-700 leading-relaxed">{gig.description}</p>
          </div>
        </div>

        {message && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 mb-6 rounded-xl">{message}</div>}

        {/* VIEW 1: OWNER VIEW */}
        {isOwner && (
          <div className="bg-white shadow-sm rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Proposals ({bids.length})</h2>
            <div className="space-y-4">
              {bids.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No proposals received yet. Check back later.</p>
                </div>
              )}
              {bids.map((bid) => (
                <div key={bid._id} className="border border-gray-200 rounded-xl p-6 hover:border-emerald-300 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{bid.freelancerId?.name || "Freelancer"}</h3>
                      <p className="text-gray-600 leading-relaxed mb-3">{bid.message}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Bid Amount:</span>
                        <span className="text-xl font-bold text-gray-900">${bid.price}</span>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      {bid.status === 'hired' && (
                        <span className="inline-block px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-semibold">Hired</span>
                      )}
                      {bid.status === 'rejected' && (
                        <span className="inline-block px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold">Declined</span>
                      )}
                      {isGigOpen && bid.status === 'pending' && (
                        <button 
                          onClick={() => handleHire(bid._id)}
                          className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition shadow-sm"
                        >
                          Hire Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: FREELANCER VIEW */}
        {!isOwner && isGigOpen && user && (
          <div className="bg-white shadow-sm rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a Proposal</h2>
            <form onSubmit={handleBidSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Bid Amount ($)</label>
                <input 
                  type="number" 
                  required
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your bid amount"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Letter</label>
                <textarea 
                  required
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Explain why you're the best fit for this project..."
                />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md">
                Submit Proposal
              </button>
            </form>
          </div>
        )}
        
        {!isGigOpen && !isOwner && (
          <div className="bg-white shadow-sm rounded-xl p-12 text-center">
            <p className="text-gray-600 text-lg">This project is no longer accepting proposals.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigDetails;