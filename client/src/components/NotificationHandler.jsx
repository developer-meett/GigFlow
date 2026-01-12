import React, { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const NotificationHandler = () => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // 👇 FIX APPLIED: Force WebSocket transport to prevent "a is not a function" crash
    const newSocket = io("https://gigflow-api-owi6.onrender.com", {
      transports: ["websocket"], 
      withCredentials: true
    });
    
    setSocket(newSocket);

    // Cleanup: Disconnect when component unmounts
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket && user) {
      // Send user ID to server so we can receive private messages
      socket.emit("addNewUser", user.id || user._id); 

      // Listen for "You got hired!" events
      socket.on("hireNotification", (data) => {
        setNotification(data.message);
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => setNotification(null), 5000);
      });
    }
  }, [socket, user]);

  // Don't render anything if there is no notification
  if (!notification) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-bounce">
      <div className="bg-green-600 text-white px-6 py-4 rounded shadow-xl flex items-center gap-3">
        <span className="text-2xl">🔔</span>
        <div>
          <h4 className="font-bold">Good News!</h4>
          <p>{notification}</p>
        </div>
        <button 
          onClick={() => setNotification(null)} 
          className="ml-4 text-white hover:text-gray-200 font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default NotificationHandler;