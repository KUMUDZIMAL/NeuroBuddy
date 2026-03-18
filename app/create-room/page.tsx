'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRoomPage() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const createRoom = () => {
    if (roomId.trim()) {
      router.push(`https://serenity-backend-liart.vercel.app/room/${roomId}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Video Call Room</h1>
      <div className="flex space-x-2">
        <input 
          type="text" 
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
          className="border p-2 flex-grow"
        />
        <button 
          onClick={createRoom}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Create Room
        </button>
      </div>
    </div>
  );
}