// app/community/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface Room {
  id: string;
  name: string;
  participants: number;
}

interface Message {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

export default function CommunityPage() {
  // 1) Initialize to safe defaults (no sessionStorage calls here)
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [isUserSelected, setIsUserSelected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // 2) On mount, load user from sessionStorage
  useEffect(() => {
    const storedId = sessionStorage.getItem("userId");
    const storedName = sessionStorage.getItem("username");
    if (storedId && storedName) {
      setUserId(storedId);
      setUsername(storedName);
      setIsUserSelected(true);
    }
  }, []);

  // 3) Fetch rooms once
  useEffect(() => {
    fetch("/api/community")
      .then((res) => res.json())
      .then(setRooms)
      .catch((e) => console.error("Error fetching rooms:", e));
  }, []);

  // 4) Poll messages when a room is selected
  useEffect(() => {
    if (!selectedRoom) return;
    let active = true;

    const fetchMsgs = async () => {
      try {
        const res = await fetch(`/api/community?roomId=${selectedRoom}`);
        if (!res.ok) throw new Error();
        const data: Message[] = await res.json();
        if (!active) return;
        setMessages((prev) => {
          if (prev.length === data.length) return prev;
          return data;
        });
        setError(null);
      } catch {
        setError("Failed to load messages");
      }
    };

    fetchMsgs();
    const interval = setInterval(fetchMsgs, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [selectedRoom]);

  // 5) Always scroll when messages change
  useEffect(scrollToBottom, [messages]);

  // Handlers (createRoom, joinRoom, leaveRoom, sendMessage) unchanged...
  const createRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "CREATE_ROOM", name: newRoomName }),
      });
      const room: Room = await res.json();
      setRooms((r) => [...r, room]);
      setNewRoomName("");
    } catch (e) {
      console.error(e);
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "UPDATE_PARTICIPANTS", roomId, change: 1 }),
      });
      const updated: Room = await res.json();
      setRooms((r) => r.map((x) => (x.id === roomId ? updated : x)));
      setSelectedRoom(roomId);
    } catch (e) {
      console.error(e);
    }
  };

  const leaveRoom = async () => {
    if (!selectedRoom) return;
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "UPDATE_PARTICIPANTS", roomId: selectedRoom, change: -1 }),
      });
      const updated: Room = await res.json();
      setRooms((r) => r.map((x) => (x.id === selectedRoom ? updated : x)));
      setSelectedRoom(null);
      setMessages([]);
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials:"include",
        body: JSON.stringify({
          type: "SEND_MESSAGE",
          roomId: selectedRoom,
          userId,
          username,
          content: newMessage,
        }),
      });
      const msg: Message = await res.json();
      setMessages((m) => [...m, msg]);
      setNewMessage("");
    } catch {
      alert("Failed to send message");
    }
  };

  // 6) Render selection screen if user not set
  if (!isUserSelected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
          <h2 className="text-2xl mb-4">Enter your username</h2>
          <input
            className="w-full p-2 border rounded mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <button
            className="w-full bg-blue-500 text-white p-2 rounded"
            onClick={() => {
              if (!username.trim()) return;
              const id = `user_${Date.now()}`;
              sessionStorage.setItem("userId", id);
              sessionStorage.setItem("username", username);
              setUserId(id);
              setIsUserSelected(true);
            }}
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  // 7) Main community UI
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {!selectedRoom ? (
        // Room list & creation
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl">Community Chat Rooms</h1>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl mb-2">Create New Room</h2>
            <div className="flex gap-2">
              <input
                className="flex-1 p-2 border rounded"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Room name"
              />
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded"
                onClick={createRoom}
              >
                Create
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl mb-2">Active Rooms</h2>
            <ul className="space-y-2">
              {rooms.map((room) => (
                <li
                  key={room.id}
                  className="flex justify-between items-center p-3 border rounded cursor-pointer hover:bg-purple-50"
                  onClick={() => joinRoom(room.id)}
                >
                  <span>
                    {room.name} ({room.participants})
                  </span>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded">
                    Join
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        // Chat window
        <div className="max-w-4xl mx-auto bg-white rounded shadow">
          <header className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg">{rooms.find((r) => r.id === selectedRoom)?.name}</h2>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={leaveRoom}
            >
              Leave
            </button>
          </header>

          <section className="h-[60vh] overflow-y-auto p-4 space-y-4">
            {error && <div className="text-red-500">{error}</div>}
            {messages.length === 0 ? (
              <div className="text-gray-400 text-center">No messages yet</div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.userId === userId ? "items-end" : "items-start"
                  }`}
                >
                  <span className="text-xs text-gray-500">{m.username}</span>
                  <div
                    className={`px-3 py-2 rounded ${
                      m.userId === userId ? "bg-purple-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {m.content}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </section>

          <footer className="p-4 border-t">
            <div className="flex gap-2">
              <input
                className="flex-1 p-2 border rounded"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
