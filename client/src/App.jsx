import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AddGig from './pages/AddGig';
import GigDetails from './pages/GigDetails'; // <--- 1. IMPORT THIS

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-gig" element={<AddGig />} />
          
          {/* 2. THIS IS THE MISSING LINE FIXING YOUR ERROR: */}
          <Route path="/gigs/:id" element={<GigDetails />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;