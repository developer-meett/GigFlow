import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Join GigFlow</h2>
        
        <input 
          className="w-full border p-2 mb-4 rounded" 
          placeholder="Full Name" 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input 
          className="w-full border p-2 mb-4 rounded" 
          placeholder="Email" 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          className="w-full border p-2 mb-6 rounded" 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Register
        </button>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;