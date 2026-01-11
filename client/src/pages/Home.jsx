import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import GigCard from '../components/GigCard';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const { data } = await api.get('/gigs');
        setGigs(data);
      } catch (err) {
        console.error("Failed to fetch gigs", err);
      }
    };
    fetchGigs();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Available Gigs</h1>
        {user && (
          <Link to="/add-gig" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow">
            + Post a Gig
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.length > 0 ? (
          gigs.map((gig) => <GigCard key={gig._id} gig={gig} />)
        ) : (
          <p className="text-gray-500">No gigs available. Be the first to post one!</p>
        )}
      </div>
    </div>
  );
};

export default Home;