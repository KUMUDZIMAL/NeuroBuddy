"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { toast } from "react-toastify"; // Import a toast library for feedback

interface Section {
  id: string;
  title: string;
  isOpen: boolean;
  items?: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
}

function MoodTracker() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter(); // Initialize the router
  const [sections, setSections] = useState<Section[]>([
    {
      id: "emotions",
      title: "Emotions",
      isOpen: true,
      items: [
        { id: "happy", label: "happy", icon: "❤️" },
        { id: "excited", label: "excited", icon: "✨" },
        { id: "grateful", label: "grateful", icon: "🤝" },
        { id: "relaxed", label: "relaxed", icon: "🌴" },
        { id: "content", label: "content", icon: "🏰" },
        { id: "tired", label: "tired", icon: "🛏️" },
        { id: "unsure", label: "unsure", icon: "🤔" },
        { id: "bored", label: "bored", icon: "😴" },
        { id: "anxious", label: "anxious", icon: "😰" },
        { id: "angry", label: "angry", icon: "😡" },
        { id: "stressed", label: "stressed", icon: "😫" },
        { id: "sad", label: "sad", icon: "😢" },
        { id: "desperate", label: "desperate", icon: "😩" },
      ],
    },
    {
      id: "sleep",
      title: "Sleep",
      isOpen: true,
      items: [],
    },
    {
      id: "better-me",
      title: "Better Me",
      isOpen: true,
      items: [
        { id: "meditation", label: "meditation", icon: "🧘" },
        { id: "exercise", label: "exercise", icon: "✋" },
        { id: "reading", label: "reading", icon: "📖" },
        { id: "savings", label: "savings", icon: "💰" },
      ],
    },
    {
      id: "water",
      title: "Water Intake",
      isOpen: true,
      items: [],
    },
    {
      id: "calories",
      title: "Food Calories",
      isOpen: true,
      items: [],
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [quickNote, setQuickNote] = useState<string>('');
  const [sleepHours, setSleepHours] = useState<number>(0);
  const [waterLiters, setWaterLiters] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0);
  const [customBetterMe, setCustomBetterMe] = useState<string>('');

  const toggleSection = (sectionId: string) => {
    setSections((sections) =>
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, isOpen: !section.isOpen }
          : section
      )
    );
  };

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSave = async () => {
    const emotion = selectedItems.filter(id =>
        sections[0].items?.some(item => item.id === id)
    ).join(', ');

    const betterMe = selectedItems.filter(id =>
        sections[2].items?.some(item => item.id === id)
    ).join(',');

    try {
        const response = await fetch('/api/analysis2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 'your_user_id_here',
                emotion,
                sleep: sleepHours,
                betterMe,
                quickNote,
                water: waterLiters,
                calories,
            }),
        });
        const data = await response.json();

        if (data.error) {
            toast.error(data.error);
        } else {
            toast.success('Data saved successfully!');
            router.push('/dashboard');
        }
    } catch (error) {
        toast.error('Error saving data');
    }
  };

  const addCustomBetterMe = () => {
    if (customBetterMe) {
      setSections((prevSections: Section[]) =>
        prevSections.map((section) =>
          section.id === "better-me"
            ? {
                ...section,
                items: [
                  ...(section.items || []),
                  { id: customBetterMe, label: customBetterMe, icon: "✨" },
                ],
              }
            : section
        )
      );
      setCustomBetterMe('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#B194D6] to-[#EBEBEE] p-4 relative">
      <div className="absolute inset-0 flex justify-center items-center z-0">
        <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
        <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
        <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
      </div>
      <div className="w-1/2 max-w-xl z-10">
        <h1 className="text-3xl font-semibold mb-6 mt-10 text-center text-[#151515]">
          What have you been up to?
        </h1>

        <div className="space-y-4 w-full">
          {sections.map((section) => (
            <div key={section.id} className="bg-white p-6 shadow-lg rounded-lg">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <h2 className="text-lg font-semibold text-[#151515]">{section.title}</h2>
                <div className="flex gap-2 items-center">
                  <Plus className="w-5 h-5 text-[#B194D6]" />
                  {section.isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#B194D6]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#B194D6]" />
                  )}
                </div>
              </div>

              {section.isOpen && (
                <div className="mt-6">
                  {section.id === "emotions" && (
                    <div className="grid grid-cols-3 gap-6">
                      {section.items?.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-lg transition-colors",
                            selectedItems.includes(item.id)
                              ? "bg-[#B194D6] text-white"
                              : "bg-[#EBEBEE] hover:bg-[#B194D6]/20 text-[#151515]"
                          )}
                        >
                          <span className="text-3xl">{item.icon}</span>
                          <span className="text-sm mt-2">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
{section.id === "sleep" && (
  <div className="flex items-center">
    <input
      type="number"
      value={sleepHours}
      onChange={(e) => setSleepHours(Math.max(0, Math.min(24, parseInt(e.target.value) || 0)))}
      className="w-full p-2 mt-2 rounded-lg hover:border-2 hover:border-violet-700 focus:border-2 focus:border-violet-700"
      min="0"
      max="24"
    />
    <span className="ml-2 text-lg">Hrs</span> {/* Unit for sleep */}
  </div>
)}

{section.id === "water" && (
  <div className="flex items-center">
    <input
      type="number"
      value={waterLiters}
      onChange={(e) => setWaterLiters(Math.max(0, parseFloat(e.target.value)))}
      placeholder="Water intake"
      min="0"
      max="40"
      className="w-full p-2 mt-2 rounded-lg hover:border-2 hover:border-violet-700 focus:border-2 focus:border-violet-700"
    />
    <span className="ml-2 text-lg">Litres</span> {/* Unit for water intake */}
  </div>
)}

{section.id === "calories" && (
  <div className="flex items-center">
    <input
      type="number"
      value={calories}
      onChange={(e) => {
        // Ensure the value is a multiple of 100 and greater than or equal to 0
        const newValue = Math.max(0, Math.floor(parseInt(e.target.value) / 100) * 100);
        setCalories(newValue);
      }}
      placeholder="Calories intake"
      min="0"
      max="20000"
      step="100" // Set the step size to 100 for increments/decrements
      className="w-full p-2 mt-2 rounded-lg hover:border-2 hover:border-violet-700 focus:border-2 focus:border-violet-700"
    />
    <span className="ml-2 text-lg">Calories</span> {/* Unit for calories */}
  </div>
)}



                  {section.id === "better-me" && (
                    <div>
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="Add custom item"
                          className="w-full p-2 rounded-lg border-2 border-violet-700 focus:border-2 focus:border-violet-700"
                          value={customBetterMe}
                          onChange={(e) => setCustomBetterMe(e.target.value)}
                        />
                        <button onClick={addCustomBetterMe} className="ml-2 bg-violet-700 text-white p-2 rounded-lg">
                          Add
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-6 mt-6">
                        {section.items?.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={cn(
                              "flex flex-col items-center justify-center p-4 rounded-lg transition-colors",
                              selectedItems.includes(item.id)
                                ? "bg-[#B194D6] text-white"
                                : "bg-[#EBEBEE] hover:bg-[#B194D6]/20 text-[#151515]"
                            )}
                          >
                            <span className="text-3xl">{item.icon}</span>
                            <span className="text-sm mt-2">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 shadow-lg rounded-lg mt-6">
          <h2 className="text-lg font-semibold text-[#151515] mb-4">Quick Note</h2>
          <form>
            <input
              type="text"
              placeholder="Write your note here..."
              className="w-full p-4  rounded-lg  border-2 border-violet-700 focus:border-2 focus:border-violet-700"
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
            />
          </form>
        </div>
        <div className="flex justify-between mt-6 w-full">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-violet-700 text-white rounded-lg   "
          >
           Skip
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-violet-700 text-white rounded-lg  "
          >
            Save
          </button>

</div>
      </div>
    </div>
  );
}

export default MoodTracker;
