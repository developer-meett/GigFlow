import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const GigDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // New Error State

  // New States for Bidding
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidPrice, setBidPrice] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    const fetchGig = async () => {
      try {
        console.log("Fetching gig with ID:", id); // DEBUG LOG
        const { data } = await api.get(`/gigs/${id}`);
        console.log("Gig Data Received:", data); // DEBUG LOG
        setGig(data);
      } catch (err) {
        console.error("Error loading gig:", err);
        setError("Failed to load gig details.");
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/gigs/${id}/proposals`, {
        price: bidPrice,
        coverLetter
      });
      alert("Bid Placed Successfully!");
      setShowBidForm(false);
      // Reload page to see new bid
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place bid");
    }
  };

  if (loading) return <div className="text-center mt-10 text-blue-600">Loading Gig Details...</div>;
  if (error) return <div className="text-center mt-10 text-red-500 font-bold">{error}</div>;
  if (!gig) return <div className="text-center mt-10">Gig not found!</div>;

  // --- SAFE RENDER CHECK ---
  // If any of these are missing, we handle it gracefully instead of crashing
  const gigDate = gig.createdAt ? new Date(gig.createdAt).toLocaleDateString() : "Date N/A";
  const deadlineDate = gig.deadline ? new Date(gig.deadline).toLocaleDateString() : "No Deadline";

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{gig.title || "Untitled Gig"}</h1>
            <p className="text-gray-500 mt-2">Posted by: <span className="font-semibold">{gig.owner?.name || "Unknown User"}</span></p>
            <p className="text-gray-400 text-sm">Posted on: {gigDate}</p>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-bold text-green-600">${gig.budget || 0}</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {(gig.status || 'open').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="prose max-w-none text-gray-700 mb-8 border-t pt-6">
          <h3 className="text-xl font-bold mb-4">Description</h3>
          <p className="whitespace-pre-line">{gig.description || "No description provided."}</p>
        </div>

        <div className="border-t pt-6">
          {!showBidForm ? (
            <div className="flex justify-between items-center">
               <p className="font-semibold text-gray-700">Deadline: {deadlineDate}</p>
               
               {/* Check if user exists AND is not the owner */}
               {user && gig.owner && user._id !== gig.owner._id && (
                 <button 
                   onClick={() => setShowBidForm(true)}
                   className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold shadow-lg"
                 >
                   Place a Bid Now
                 </button>
               )}
            </div>
          ) : (
            <form onSubmit={handleBidSubmit} className="bg-gray-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-bold mb-4">Submit Your Proposal</h3>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Your Price ($)</label>
                <input 
                  type="number" 
                  className="w-full border p-2 rounded" 
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Cover Letter</label>
                <textarea 
                  className="w-full border p-2 rounded h-24" 
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-4">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold">Submit</button>
                <button type="button" onClick={() => setShowBidForm(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* Proposals Section */}
        {gig.proposals && gig.proposals.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Current Bids ({gig.proposals.length})</h3>
            <div className="space-y-4">
              {gig.proposals.map((prop, index) => (
                <div key={index} className="border p-4 rounded bg-gray-50">
                   <div className="flex justify-between font-bold">
                      <span>{prop.freelancerName || "Freelancer"}</span>
                      <span className="text-green-600">${prop.price}</span>
                   </div>
                   <p className="text-gray-600 mt-2">{prop.coverLetter}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigDetails;