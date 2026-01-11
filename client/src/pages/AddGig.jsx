import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AddGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/gigs', formData);
      navigate('/'); // Go back to Home to see the new gig
    } catch (err) {
      alert("Failed to post gig");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Post a New Gig</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Gig Title</label>
          <input 
            className="w-full border p-2 rounded" 
            placeholder="e.g. Build a React Website"
            required
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea 
            className="w-full border p-2 rounded h-32" 
            placeholder="Describe the details..."
            required
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Budget ($)</label>
            <input 
              type="number"
              className="w-full border p-2 rounded" 
              placeholder="500"
              required
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Deadline</label>
            <input 
              type="date"
              className="w-full border p-2 rounded" 
              required
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white font-bold p-3 rounded hover:bg-blue-700">
          Post Gig
        </button>
      </form>
    </div>
  );
};

export default AddGig;