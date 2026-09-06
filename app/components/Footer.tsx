export default function Footer() {
  return (
    <footer className="bg-blue-800 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        
        {/* About */}
        <div>
          <h3 className="font-bold text-blue-200 mb-3">MyResult</h3>
          <p className="text-gray-300 text-xs">
            Fast, reliable and student-focused government job platform.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold mb-3">Quick Links</h3>
          <ul className="space-y-1 text-gray-300">
            <li><a href="/jobs" className="hover:text-yellow-400">Latest Jobs</a></li>
            <li><a href="/results" className="hover:text-yellow-400">Results</a></li>
            <li><a href="/admit-card" className="hover:text-yellow-400">Admit Card</a></li>
            <li><a href="/answer-key" className="hover:text-yellow-400">Answer Key</a></li>
          </ul>
        </div>

        {/* More Links */}
        <div>
          <h3 className="font-bold mb-3">More</h3>
          <ul className="space-y-1 text-gray-300">
            <li><a href="/syllabus" className="hover:text-yellow-400">Syllabus</a></li>
            <li><a href="/exam-calendar" className="hover:text-yellow-400">Exam Calendar</a></li>
            <li><a href="/tools" className="hover:text-yellow-400">Tools</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-bold mb-3">Legal</h3>
          <ul className="space-y-1 text-gray-300">
            <li><a href="/about" className="hover:text-yellow-400">About</a></li>
            <li><a href="/contact" className="hover:text-yellow-400">Contact</a></li>
            <li><a href="/privacy" className="hover:text-yellow-400">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-yellow-400">Terms</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-800 text-center text-xs text-gray-400 py-3">
        © 2024 MyResult. All rights reserved.
      </div>
    </footer>
  )
}