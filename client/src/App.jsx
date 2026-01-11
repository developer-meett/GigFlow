import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; 
import AddGig from './pages/AddGig'; // <--- 1. NEW IMPORT

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 2. NEW ROUTE BELOW */}
          <Route path="/add-gig" element={<AddGig />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;