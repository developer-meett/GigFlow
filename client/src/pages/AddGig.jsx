import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const AddGig = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await axios.post('/gigs', formData);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to post gig. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg mt-10 rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Post a New Gig</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold mb-1">Job Title</label>
          <input 
            type="text" 
            required 
            className="w-full border p-2 rounded"
            placeholder="e.g. Build a React Website"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Description</label>
          <textarea 
            required 
            className="w-full border p-2 rounded h-32"
            placeholder="Describe the project details..."
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-bold mb-1">Budget ($)</label>
            <input 
              type="number" 
              required 
              className="w-full border p-2 rounded"
              placeholder="500"
              value={formData.budget}
              onChange={e => setFormData({...formData, budget: e.target.value})}
            />
          </div>
          <div className="flex-1">
            <label className="block font-bold mb-1">Deadline</label>
            <input 
              type="date" 
              className="w-full border p-2 rounded"
              value={formData.deadline}
              onChange={e => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 rounded font-bold text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? 'Publishing...' : 'Publish Gig'}
        </button>
      </form>
    </div>
  );
};

export default AddGig;