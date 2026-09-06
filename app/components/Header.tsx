'use client'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="shadow-md">
      {/* Top bar */}
      <div className="bg-blue-900 text-white text-xs py-1.5 px-4 flex justify-between items-center">
        <span>info@myresult.in</span>
        <div className="hidden md:flex gap-4">
          <span className="absolute left-1/2 -translate-x-1/2 hidden md:block">
    Welcome to MyResult - Your Trusted Government Job Portal
  </span>
          <a href="#" className="hover:underline">Telegram</a>
          <a href="#" className="hover:underline">WhatsApp</a>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">MR</div>
            <div>
              <div className="text-lg font-bold text-blue-800">MY RESULT</div>
              <div className="text-xs text-gray-800">Fastest Updates • Trusted by Students</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-gray-700">
            <a href="/" className="text-blue-700 border-b-2 border-blue-700 pb-0.5">HOME</a>
            <a href="/jobs" className="hover:text-blue-700">JOBS</a>
            <a href="/results" className="hover:text-blue-700">RESULTS</a>
            <a href="/admit-card" className="hover:text-blue-700">ADMIT CARD</a>
            <a href="/answer-key" className="hover:text-blue-700">ANSWER KEY</a>
            <a href="/syllabus" className="hover:text-blue-700">SYLLABUS</a>
            <a href="/tools" className="hover:text-blue-700">TOOLS</a>
            <div className="relative group">
              <button className="hover:text-blue-700 flex items-center gap-0.5">
                MORE <span className="text-xs">v</span>
              </button>
              <div className="absolute top-6 right-0 bg-white border border-gray-200 rounded-lg shadow-lg w-44 hidden group-hover:block z-50">
                <a href="/exam-calendar" className="block px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700">Exam Calendar</a>
                <a href="/alerts" className="block px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700">Job Alerts</a>
                <a href="/about" className="block px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700">About Us</a>
                <a href="/contact" className="block px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700">Contact</a>
              </div>
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <a href="/login" className="hidden md:block border border-blue-700 text-blue-700 text-xs px-3 py-1.5 rounded hover:bg-blue-50">Login</a>
            <a href="/register" className="hidden md:block bg-blue-700 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-600">Register</a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden flex flex-col gap-1 p-2">
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-2">
            <a href="/" className="block text-sm font-semibold text-blue-700 py-2 border-b border-gray-100">Home</a>
            <a href="/jobs" className="block text-sm text-gray-700 py-2 border-b border-gray-100 hover:text-blue-700">Jobs</a>
            <a href="/results" className="block text-sm text-gray-700 py-2 border-b border-gray-100 hover:text-blue-700">Results</a>
            <a href="/admit-card" className="block text-sm text-gray-700 py-2 border-b border-gray-100 hover:text-blue-700">Admit Card</a>
            <a href="/answer-key" className="block text-sm text-gray-700 py-2 border-b border-gray-100 hover:text-blue-700">Answer Key</a>
            <a href="/syllabus" className="block text-sm text-gray-700 py-2 border-b border-gray-100 hover:text-blue-700">Syllabus</a>
            <a href="/tools" className="block text-sm text-gray-700 py-2 border-b border-gray-100 hover:text-blue-700">Tools</a>
            <a href="/exam-calendar" className="block text-sm text-gray-700 py-2 border-b border-gray-100 hover:text-blue-700">Exam Calendar</a>
            <a href="/alerts" className="block text-sm text-gray-700 py-2 border-b border-gray-100 hover:text-blue-700">Job Alerts</a>
            <div className="flex gap-2 pt-2">
              <a href="/login" className="flex-1 text-center border border-blue-700 text-blue-700 text-sm px-3 py-2 rounded hover:bg-blue-50">Login</a>
              <a href="/register" className="flex-1 text-center bg-blue-700 text-white text-sm px-3 py-2 rounded hover:bg-blue-600">Register</a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}