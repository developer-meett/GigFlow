import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">GigFlow</Link>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-semibold">Hello, {user.name}</span>
            <button onClick={logout} className="text-red-500 hover:underline">Logout</button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded">Join</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;