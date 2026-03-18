'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Activity {
  emoji: string
  label: string
  bgColor: string
}

interface InputData {
  date: string
  mood: {
    emoji: string
    label: string
    color: string
  }
  activities: Activity[]
  note: string
}
const items2 =   [
  { id: "meditation", label: "meditation", icon: "🧘" },
  { id: "exercise", label: "exercise", icon: "✋" },
  { id: "reading", label: "reading", icon: "📖" },
  { id: "savings", label: "savings", icon: "💰" },
]

const items = [
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
]

const moods = [
 
    { emoji: "🌟", label: "Awesome" },
    { emoji: "😊", label: "Great" },
    { emoji: "😍", label: "Loved" },
    { emoji: "🙂", label: "Okay" },
    { emoji: "😕", label: "Meh" },
    { emoji: "😥", label: "Anxious" },
    { emoji: "☹️", label: "Bad" },
    { emoji: "😖", label: "Terrible" },
    { emoji: "😡", label: "Upset" },
  
];

const HorizontalScrollInputCard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userData, setUserData] = useState<{
    username: string | null
    analysis: Array<{
      mood: string
      emotion: string
      sleep: number
      betterMe: string
      quickNote: string
      water: number
      calories: number
      createdAt: string
    }>
  }>({
    username: null,
    analysis: [],
  })

  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/inputCard', { method: 'GET' })

        if (response.status === 401) {
          router.push('/auth/login')
          return
        }

        if (!response.ok) {
          console.error('Unexpected response:', await response.text())
          router.push('/auth/login')
          return
        }

        const data = await response.json()
        console.log('Fetched data:', data)

        if (data.username) {
          setUserData({
            username: data.username,
            analysis: data.analysis || [],
          })
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const data1 = userData.analysis || []

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : data1.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < data1.length - 1 ? prevIndex + 1 : 0))
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {data1.map((entry, index) => {
            const emo = Array.isArray(entry.emotion) ? entry.emotion[0] : entry.emotion

            const imo = Array.isArray(entry.betterMe) ? entry.betterMe[0] : entry.betterMe


            const matchedMood = moods.find((mood) => mood.label === entry.mood)
            const matchedEmotion = items.find((emotion) => emotion.label === emo)
            const matchedBetterMe = items2.find((item) => item.label === imo)
            const information: InputData = {
              date:entry.createdAt
              ? new Date(entry.createdAt).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }) + ' ' + new Date(entry.createdAt).toLocaleTimeString('en-IN', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })
              : 'Loading...',
              mood: matchedMood
                ? { emoji: matchedMood.emoji, label: matchedMood.label, color: 'green' }
                : { emoji: '❓', label: 'Unknown', color: 'gray' },
              activities: [
                { emoji: matchedEmotion?.icon || '❓', label: `${entry.emotion} `, bgColor: 'green' },
                { emoji: '💤', label: `${entry.sleep} hrs`, bgColor: 'blue' },
                { emoji: '🔥', label: `${entry.calories} Kcal`, bgColor: 'orange' },
                { emoji: '💧', label: `${entry.water} L`, bgColor: 'blue' },
                { emoji: matchedBetterMe?.icon || '🌟', label: `${entry.betterMe}`, bgColor: 'purple' },
              ],
              note: entry.quickNote || 'No notes added.',
            }

            return (
              <div key={index} className="w-full flex-shrink-0">
                <div className="bg-white rounded-3xl pr-6 pl-6 transition-shadow duration-300">
                  {/* Date Section */}
                  <div className="text-slate-500 font-medium text-sm mb-4 uppercase tracking-wide">
                    {information.date}
                  </div>

                  {/* Mood Section */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div
                      className={`w-12 h-12 rounded-full flex justify-center items-center text-2xl shadow-inner ${information.mood.color ? `bg-${information.mood.color}-100` : 'bg-gray-100'}`}
                    >
                      {information.mood.emoji}
                    </div>
                    <div>
                      <span className={`text-${information.mood.color}-500 font-bold text-xl`}>
                        {information.mood.label}
                      </span>
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="text-slate-600 text-sm flex flex-wrap gap-4 mb-6">
                    {information.activities.map((activity, activityIndex) => (
                      <div
                        key={activityIndex}
                        className={`flex items-center space-x-2 bg-${activity.bgColor}-50 px-3 py-1 rounded-full`}
                      >
                        <span className="text-lg">{activity.emoji}

                          
                        </span>
                        <span className="font-medium">{activity.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Note Section */}
                  <div className="text-slate-600 text-sm bg-gray-50 p-3 rounded-xl italic">
                    "{information.note}"
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
        aria-label="Go to previous entry"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
        aria-label="Go to next entry"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>

      {/* Input Counter */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-4 text-sm text-gray-500">
        {currentIndex + 1} / {data1.length}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-8 flex space-x-2 p-6">
        {data1.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HorizontalScrollInputCard
