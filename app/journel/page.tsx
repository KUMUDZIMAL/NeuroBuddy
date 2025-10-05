'use client'

import React, { useState, useEffect } from 'react'
import { Search, Plus, Settings, Trash2, Edit } from 'lucide-react'
import { motion } from 'framer-motion'

interface Note {
  id: number
  title: string
  content: string
  category: string
  color: string
}

export default function Journal() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All Notes')

  useEffect(() => {
    // Simulating fetched notes
    const fetchedNotes: Note[] = [
      { id: 1, title: 'Daily Plans', content: '- Wake up\n- Go to a meeting\n- Lunch with John\n- Finish report', category: 'Personal', color: 'bg-pink-200' },
      { id: 2, title: 'Pronunciation', content: 'Practice pronunciation daily', category: 'Study', color: 'bg-purple-200' },
      { id: 3, title: 'Passwords', content: 'WiFi: 12345678\nGoogle: mypassword123', category: 'Personal', color: 'bg-cyan-100' },
      { id: 4, title: 'Mailing', content: 'Hi! Great to meet you.', category: 'Work', color: 'bg-blue-200' },
      { id: 5, title: 'Call Summary', content: "Here's a summary of highlights with John.", category: 'Work', color: 'bg-green-200' }
    ]
    setNotes(fetchedNotes)
  }, [])

  const filteredNotes = notes.filter(note =>
    (selectedCategory === 'All Notes' || note.category === selectedCategory) &&
    (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      category: selectedCategory === 'All Notes' ? 'Personal' : selectedCategory,
      color: 'bg-gray-200'
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
    setIsEditing(true)
  }

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
      setIsEditing(false)
    }
  }

  const editNote = (note: Note) => {
    setSelectedNote(note)
    setIsEditing(true)
  }

  const saveNote = (updatedNote: Note) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note))
    setSelectedNote(updatedNote)
    setIsEditing(false)
  }

  return (
    <div className="flex h-screen">
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
        <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
        <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
      </div>
     
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-64 p-6 backdrop-blur-sm shadow-lg bg-white/60"
      >
        <h1 className="mb-8 text-2xl font-bold text-slate-800 font-valueSerif">My Journal</h1>
        <nav className="space-y-4 font-copernicusMedium">
          {['All Notes', 'Personal', 'Work', 'Study', 'Miscellaneous'].map((category, index) => (
            <motion.a
              key={index}
              href="#"
              className={`flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-violet-200 transition-all duration-100 mr-1${selectedCategory === category ? 'bg-gray-200' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </motion.a>
          ))}
        </nav>
        <button onClick={addNote} className="w-full p-2 mt-8 text-white bg-purple-500 hover:scale-[1.02] hover:bg-purple-600 rounded-2xl shadow-md font-outfitLight font-bold transition-all">
          Add New
        </button>
      </motion.aside>

      {/* Main content */}
      <motion.main
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 p-8 overflow-auto  backdrop-blur-sm z-10"
      >
        {/* Search and add new note */}
        <div className="flex items-center justify-between mb-6 font-copernicusMedium">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-64 py-2 pl-10 pr-4 text-slate-700 border rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              className="p-2 bg-blue-100 rounded-full"
              onClick={addNote}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="text-blue-600" size={20} />
            </motion.button>
            <motion.button
              className="p-2 bg-gray-200 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Settings className="text-gray-600" size={20} />
            </motion.button>
          </div>
        </div>

        {/* Notes grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              className={`${note.color} p-4 rounded-lg shadow relative`}
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="mb-2 font-bold text-slate-800 font-copernicusMedium">{note.title}</h3>
              <p className="text-sm text-slate whitespace-pre-line font-outfitRegular">{note.content}</p>
              <div className="absolute flex space-x-2 top-2 right-2">
                <motion.button
                  onClick={() => editNote(note)}
                  className="p-1 bg-white rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit className="text-black" size={16} />
                </motion.button>
                <motion.button
                  onClick={() => deleteNote(note.id)}
                  className="p-1 bg-white rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="text-black" size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>

      {/* Edit Modal */}
      {isEditing && selectedNote && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="w-1/2 p-6 bg-white/80 backdrop-blur-sm rounded-3xl">
            <h2 className="mb-4 text-2xl font-bold text-slate-700 font-copernicusMedium">Edit Note</h2>
            <input
              type="text"
              value={selectedNote.title}
              onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
              className="w-full p-2 mb-4 text-slate-800 border rounded"
            />
            <textarea
              value={selectedNote.content}
              onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
              className="w-full h-40 p-2 mb-4 text-slate-800 border rounded"
            />
            <select
              value={selectedNote.category}
              onChange={(e) => setSelectedNote({ ...selectedNote, category: e.target.value })}
              className="w-full p-2 mb-4 text-slate-800 ring-0 focus:ring-2 rounded"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Study">Study</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all rounded-2xl">
                Cancel
              </button>
              <button onClick={() => saveNote(selectedNote)} className="px-4 py-2 text-white bg-violet-500 hover:bg-violet-600 transition-all rounded-2xl">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

