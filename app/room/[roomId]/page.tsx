'use client';

import { useParams } from 'next/navigation';
import VideoCall from '@/myComponents/VideoCall';
import { useState, useEffect } from 'react';

export default function RoomPage() {
  const params = useParams();
  const [userID, setUserID] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Generate unique user ID and name
    const generateUserDetails = () => {
      const id = `user_${Math.random().toString(36).substr(2, 9)}`;
      const name = `User_${Math.random().toString(36).substr(2, 5)}`;
      
      setUserID(id);
      setUserName(name);
    };

    generateUserDetails();
  }, []);

  if (!userID || !userName) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video Call Room</h1>
      <VideoCall 
        roomID={params.roomId as string} 
        userID={userID}
        userName={userName}
      />
    </div>
  );
}