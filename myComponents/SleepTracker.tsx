"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SleepTracker: React.FC = () => {
  const [hoursSlept, setHoursSlept] = useState<number>(0);
  const [quality, setQuality] = useState<string>('good');
  const [notes, setNotes] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const router = useRouter();

  const handleSleepSubmit = async () => {
    const response = await fetch('/api/sleep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'USER_ID', hoursSlept, quality, notes, date: selectedDate }),
    });

    if (response.ok) {
      console.log('Sleep data saved successfully');
      router.push('/Input2');
    } else {
      console.error('Failed to save sleep data');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#B194D6] to-[#EBEBEE] p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold mb-8">How did you sleep?</h2>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="p-2 mb-6" />
        <input type="number" value={hoursSlept} onChange={(e) => setHoursSlept(Number(e.target.value))} placeholder="Hours Slept" className="p-2 mb-6" />
        <select value={quality} onChange={(e) => setQuality(e.target.value)} className="p-2 mb-6">
          <option value="good">Good</option>
          <option value="medium">Medium</option>
          <option value="bad">Bad</option>
        </select>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className="p-2 mb-6" />
        <button onClick={handleSleepSubmit} className="px-6 py-2 bg-[#B194D6] text-white rounded-lg">Save Sleep Data</button>
      </div>
    </div>
  );
};

export default SleepTracker;