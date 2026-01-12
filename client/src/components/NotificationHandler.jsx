import React, { useEffect, useState, useContext } from 'react';
// 👇 CHANGED: Import everything as an object to safely extract the function
import * as socketIoClient from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const NotificationHandler = () => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {

    const io = socketIoClient.io || socketIoClient.default || socketIoClient;

    try {
      const newSocket = io("https://gigflow-api-owi6.onrender.com", {
        transports: ["websocket"], // Force WebSocket to avoid polling crash
        withCredentials: true,
        reconnectionAttempts: 5,   // Stop trying if it fails too many times
      });
      
      setSocket(newSocket);
      return () => newSocket.disconnect();
    } catch (err) {
      console.error("Socket connection failed", err);
    }
  }, []);

  useEffect(() => {
    if (socket && user) {
      // Wrap emit in try-catch to prevent app crash
      try {
        socket.emit("addNewUser", user.id || user._id); 
        socket.on("hireNotification", (data) => {
          setNotification(data.message);
          setTimeout(() => setNotification(null), 5000);
        });
      } catch (e) {
        console.log("Socket emit error", e);
      }
    }
  }, [socket, user]);

  if (!notification) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-bounce">
      <div className="bg-green-600 text-white px-6 py-4 rounded shadow-xl flex items-center gap-3">
        <span className="text-2xl">🔔</span>
        <div>
          <h4 className="font-bold">Good News!</h4>
          <p>{notification}</p>
        </div>
        <button onClick={() => setNotification(null)} className="ml-4 text-white hover:text-gray-200">✕</button>
      </div>
    </div>
  );
};

export default NotificationHandler;