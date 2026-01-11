import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/'); // Redirect to Home after login
    } catch (err) {
      alert("Login Failed. Check credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        
        <input 
          className="w-full border p-2 mb-4 rounded" 
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          className="w-full border p-2 mb-6 rounded" 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Login
        </button>
        <p className="mt-4 text-center text-sm">
          New here? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;