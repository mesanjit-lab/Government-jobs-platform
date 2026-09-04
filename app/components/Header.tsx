export default function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      {/* Top utility bar */}
      <div className="bg-blue-900 text-xs py-1 px-4 flex justify-between items-center">
        <span>📧 contact@myresult.in</span>
        <div className="flex gap-3">
          <a href="#" className="hover:underline">Telegram</a>
          <a href="#" className="hover:underline">WhatsApp</a>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight">
          My<span className="text-yellow-400">Result</span>
        </div>

        {/* Navigation links */}
        <nav className="flex gap-4 text-sm font-medium">
          <a href="/" className="hover:text-yellow-400">Home</a>
          <a href="/jobs" className="hover:text-yellow-400">Jobs</a>
          <a href="/results" className="hover:text-yellow-400">Results</a>
          <a href="/admit-card" className="hover:text-yellow-400">Admit Card</a>
          <a href="/answer-key" className="hover:text-yellow-400">Answer Key</a>
          <a href="/syllabus" className="hover:text-yellow-400">Syllabus</a>
        </nav>

        {/* Login button */}
        <a href="/login" className="bg-yellow-400 text-blue-900 px-4 py-1.5 rounded font-semibold text-sm hover:bg-yellow-300">
          Login
        </a>
      </div>
    </header>
  )
}