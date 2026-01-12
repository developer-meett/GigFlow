import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GigDetails from './pages/GigDetails';
import AddGig from './pages/AddGig'; // We will create this next
import MyGigs from './pages/MyGigs'; // We will create this next
import { AuthProvider } from './context/AuthContext';
import NotificationHandler from './components/NotificationHandler';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <NotificationHandler />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* CRITICAL FIX: Put specific routes BEFORE dynamic :id routes */}
          <Route path="/add" element={<AddGig />} /> 
          <Route path="/dashboard" element={<MyGigs />} />
          
          <Route path="/gigs/:id" element={<GigDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;