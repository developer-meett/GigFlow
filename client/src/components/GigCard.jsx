import { Link } from 'react-router-dom';

const GigCard = ({ gig }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{gig.title}</h3>
          <p className="text-sm text-gray-500 mt-1">Posted by: {gig.owner?.name || "Unknown"}</p>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          ${gig.budget}
        </span>
      </div>
      
      <p className="text-gray-600 mt-4 line-clamp-2">{gig.description}</p>
      
      <div className="mt-4 flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded ${gig.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {gig.status.toUpperCase()}
        </span>
        
        <Link to={`/gigs/${gig._id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default GigCard;