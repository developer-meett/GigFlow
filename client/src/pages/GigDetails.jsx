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
    <div className="max-w-4xl mx-auto p-8">
      {/* Gig Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{gig.title}</h1>
        <div className="flex justify-between items-center text-gray-600 mb-4">
          {/* FIX: Handle missing owner name gracefully */}
          <span>Posted by: {gig.owner ? gig.owner.name : "Unknown User"}</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${isGigOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {gig.status.toUpperCase()}
          </span>
        </div>
        <p className="text-gray-700 mb-4">{gig.description}</p>
        <div className="text-xl font-bold">Budget: ${gig.budget}</div>
      </div>

      {message && <div className="bg-blue-100 text-blue-700 p-3 mb-4 rounded">{message}</div>}

      {/* VIEW 1: OWNER VIEW */}
      {isOwner && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Proposals ({bids.length})</h2>
          <div className="space-y-4">
            {bids.length === 0 && <p className="text-gray-500">No bids yet.</p>}
            {bids.map((bid) => (
              <div key={bid._id} className="bg-white p-4 shadow rounded border border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{bid.freelancerId?.name || "Freelancer"}</h3>
                  <p className="text-gray-600">{bid.message}</p>
                  <p className="font-semibold mt-1">Bid Price: ${bid.price}</p>
                  {bid.status === 'hired' && <span className="text-green-600 font-bold">HIRED</span>}
                  {bid.status === 'rejected' && <span className="text-red-400 font-bold">REJECTED</span>}
                </div>
                
                {isGigOpen && bid.status === 'pending' && (
                  <button 
                    onClick={() => handleHire(bid._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Hire
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: FREELANCER VIEW */}
      {!isOwner && isGigOpen && user && (
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Place a Bid</h2>
          <form onSubmit={handleBidSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Price ($)</label>
              <input 
                type="number" 
                required
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cover Letter</label>
              <textarea 
                required
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                className="w-full p-2 border rounded h-32"
                placeholder="Why are you the best fit for this gig?"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
              Submit Proposal
            </button>
          </form>
        </div>
      )}
      
      {!isGigOpen && !isOwner && (
        <div className="bg-gray-200 p-4 rounded text-center text-gray-600 font-bold">
          This gig is closed/assigned.
        </div>
      )}
    </div>
  );
};

export default GigDetails;