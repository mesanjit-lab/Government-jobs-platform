'use client'
import { useState } from 'react'
import { getLatestRecruitments, hasRecruitmentDetail } from '../../lib/data/recruitments'
import { Search, Bell, Menu, X, Home, Briefcase, BarChart2, Wrench, AlertCircle, ChevronRight, MapPin, GraduationCap } from 'lucide-react'

// ============================================================
// DATA — same as homepage
// ============================================================
const latestResults = [
  { id: 1, title: "SSC CGL 2023 Final Result", org: "Staff Selection Commission", date: "07 May 2024", badge: "New" },
  { id: 2, title: "Bihar Police Result 2023", org: "Bihar Police", date: "05 May 2024", badge: "New" },
  { id: 3, title: "Railway NTPC CBT 2 Result", org: "Indian Railways", date: "03 May 2024", badge: "New" },
]

const latestAdmitCards = [
  { id: 1, title: "RRB NTPC Admit Card 2024", org: "Indian Railways", examDate: "15 May 2024", status: "Available" },
  { id: 2, title: "SSC CHSL Admit Card 2024", org: "Staff Selection Commission", examDate: "20 May 2024", status: "Available" },
  { id: 3, title: "Bihar Police Admit Card 2024", org: "Bihar Police", examDate: "25 May 2024", status: "Available" },
]

const tools = [
  { label: "Exam Calendar", icon: "📅", href: "/exam-calendar" },
  { label: "Syllabus", icon: "📚", href: "/syllabus" },
  { label: "Eligibility", icon: "✅", href: "/tools/eligibility-checker" },
  { label: "Age Calc", icon: "🎂", href: "/tools/age-calculator" },
  { label: "Photo & Sign", icon: "🖼️", href: "/tools/photo-resize" },
  { label: "More", icon: "➕", href: "/tools" },
]

const closingSoon = [
  { id: 1, title: "SSC CHSL 2024", daysLeft: "10 Days Left", urgent: true },
  { id: 2, title: "Bihar Police Constable 2024", daysLeft: "15 Days Left", urgent: false },
  { id: 3, title: "Railway Group D 2024", daysLeft: "20 Days Left", urgent: false },
]

const states = ["Bihar", "Uttar Pradesh", "Rajasthan", "Delhi", "Jharkhand", "Maharashtra"]
const qualifications = ["10th Pass", "12th Pass", "ITI", "Graduate", "B.Tech", "Post Graduate"]

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Jobs", icon: Briefcase, href: "/jobs" },
  { label: "Results", icon: BarChart2, href: "/results" },
  { label: "Tools", icon: Wrench, href: "/tools" },
  { label: "Alerts", icon: AlertCircle, href: "/register" },
]

export default function MobileHome() {
  const latestJobs = getLatestRecruitments(3)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Home')

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* ── Sticky Mobile Header ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => setMenuOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-lg font-black text-blue-900">My</span>
            <span className="text-lg font-black text-blue-600">Result</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 relative">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Slide-in Mobile Menu ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 bg-white h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100">
              <span className="text-lg font-black text-blue-900">My<span className="text-blue-600">Result</span></span>
              <button onClick={() => setMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {[
                { label: "Home", href: "/" },
                { label: "Latest Jobs", href: "/jobs" },
                { label: "Results", href: "/results" },
                { label: "Admit Card", href: "/admit-card" },
                { label: "Answer Key", href: "/answer-key" },
                { label: "Syllabus", href: "/syllabus" },
                { label: "Exam Calendar", href: "/exam-calendar" },
                { label: "Tools", href: "/tools" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <a key={item.label} href={item.href}
                  className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-b border-gray-50">
                  {item.label}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <a href="/login" className="flex-1 text-center border-2 border-blue-700 text-blue-700 py-2 rounded-xl text-sm font-bold">Login</a>
              <a href="/register" className="flex-1 text-center bg-blue-700 text-white py-2 rounded-xl text-sm font-bold">Register</a>
            </div>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMenuOpen(false)}></div>
        </div>
      )}

      {/* ── Hero Card ── */}
      <section className="bg-blue-50 px-4 pt-4 pb-5">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100">
          <h1 className="text-xl font-black text-blue-900 leading-tight mb-1">
            Find Your Perfect<br />
            <span className="text-blue-600">Government Job</span>
          </h1>
          <p className="text-xs text-gray-500 mb-3">Search thousands of jobs, results, admit cards and more.</p>

          {/* Search */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-500">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Search jobs, exams, departments..."
                className="flex-1 text-xs outline-none bg-transparent text-gray-700 placeholder-gray-400" />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: "Qualification", placeholder: "Select" },
              { label: "State", placeholder: "Select" },
              { label: "Age", placeholder: "Select" },
              { label: "Category", placeholder: "Select" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-gray-500 mb-1">{f.label}</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-blue-500">
                  <option>{f.placeholder}</option>
                </select>
              </div>
            ))}
          </div>

          <button className="w-full bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 flex items-center justify-center gap-2">
            <Search className="w-4 h-4" /> Find My Jobs
          </button>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="px-4 py-3">
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: "50K+", label: "Jobs" },
            { value: "100K+", label: "Results" },
            { value: "20K+", label: "Admit Cards" },
            { value: "Daily", label: "Updates" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-2 text-center border border-gray-100 shadow-sm">
              <div className="text-sm font-black text-blue-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Latest Jobs ── */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900">🔥 Latest Jobs</h2>
            <a href="/jobs" className="text-xs text-blue-600 font-semibold">View All →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {latestJobs.map((job) => (
              <a href={job.detail ? "/jobs/" + job.id : undefined} key={job.id} className={`flex items-center gap-3 px-4 py-3 transition ${job.detail ? 'hover:bg-blue-50' : ''}`}>
                {/* Org Icon */}
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-black text-blue-700">{job.organization.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-blue-900 truncate">{job.title}</p>
                  <p className="text-xs text-gray-400 truncate">{job.organization.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">👥 {job.vacancies}</span>
                    <span className="text-xs text-gray-500">🎓 {job.qualification}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    job.id === '1' ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                  }`>{job.id === '1' ? '10 Days Left' : job.id === '2' ? '15 Days Left' : '20 Days Left'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    job.status === "Hot" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                  }`}>{job.status}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </a>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-gray-50">
            <a href="/jobs" className="block text-center text-xs text-blue-600 font-semibold py-1">View All Latest Jobs →</a>
          </div>
        </div>
      </section>

      {/* ── Latest Results + Admit Cards ── */}
      <section className="px-4 py-2">
        <div className="grid grid-cols-2 gap-3">
          {/* Results */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-3 py-2.5 border-b border-gray-50">
              <h2 className="text-xs font-bold text-gray-900">📊 Results</h2>
              <a href="/results" className="text-xs text-blue-600">All →</a>
            </div>
            <div className="divide-y divide-gray-50">
              {latestResults.map((r) => (
                <a href={"/results/" + r.id} key={r.id} className="block px-3 py-2 hover:bg-green-50 transition">
                  <p className="text-xs font-semibold text-blue-900 leading-tight line-clamp-2">{r.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{r.date}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold mt-1 inline-block">{r.badge}</span>
                </a>
              ))}
            </div>
            <div className="px-3 py-2 border-t border-gray-50">
              <a href="/results" className="block text-center text-xs text-blue-600 font-semibold">View All →</a>
            </div>
          </div>

          {/* Admit Cards */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-3 py-2.5 border-b border-gray-50">
              <h2 className="text-xs font-bold text-gray-900">🪪 Admit Cards</h2>
              <a href="/admit-card" className="text-xs text-blue-600">All →</a>
            </div>
            <div className="divide-y divide-gray-50">
              {latestAdmitCards.map((c) => (
                <a href={"/admit-card/" + c.id} key={c.id} className="block px-3 py-2 hover:bg-purple-50 transition">
                  <p className="text-xs font-semibold text-blue-900 leading-tight line-clamp-2">{c.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{c.examDate}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold mt-1 inline-block">{c.status}</span>
                </a>
              ))}
            </div>
            <div className="px-3 py-2 border-t border-gray-50">
              <a href="/admit-card" className="block text-center text-xs text-blue-600 font-semibold">View All →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Important Tools ── */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Important Tools</h2>
          <div className="grid grid-cols-3 gap-2">
            {tools.map((tool) => (
              <a key={tool.label} href={tool.href}
                className="flex flex-col items-center gap-1 py-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition border border-gray-100">
                <span className="text-xl">{tool.icon}</span>
                <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{tool.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Soon ── */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900">⏰ Closing Soon</h2>
            <a href="/jobs" className="text-xs text-blue-600 font-semibold">View All →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {closingSoon.map((job) => (
              <a href={hasRecruitmentDetail(String(job.id)) ? "/jobs/" + job.id : undefined} key={job.id} className="flex items-center justify-between px-4 py-3 hover:bg-red-50 transition">
                <span className="text-xs font-semibold text-gray-800">{job.title}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${job.urgent ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                    {job.daysLeft}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jobs by State ── */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-blue-600" /> Jobs by State
            </h2>
            <a href="/jobs" className="text-xs text-blue-600 font-semibold">View All →</a>
          </div>
          <div className="flex flex-wrap gap-2">
            {states.map((s) => (
              <a key={s} href={"/jobs?state=" + s}
                className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full font-medium hover:bg-blue-100 transition">
                {s}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jobs by Qualification ── */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-blue-600" /> Jobs by Qualification
            </h2>
            <a href="/jobs" className="text-xs text-blue-600 font-semibold">View All →</a>
          </div>
          <div className="flex flex-wrap gap-2">
            {qualifications.map((q) => (
              <a key={q} href={"/jobs?qualification=" + q}
                className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full font-medium hover:bg-green-100 transition">
                {q}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Job Alerts CTA ── */}
      <section className="px-4 py-2">
        <div className="bg-blue-700 rounded-2xl p-5 text-center">
          <div className="text-2xl mb-2">🔔</div>
          <h2 className="text-sm font-bold text-white mb-1">Never Miss a Job Alert!</h2>
          <p className="text-xs text-blue-200 mb-3">Get instant notifications for new jobs, results and admit cards.</p>
          <a href="/register" className="block bg-white text-blue-700 font-bold text-sm py-2.5 rounded-xl hover:bg-blue-50">
            Get Free Job Alerts
          </a>
        </div>
      </section>

      <div className="h-4"></div>

      {/* ── Fixed Bottom Navigation ── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.label === activeNav
            return (
              <a key={item.label} href={item.href}
                onClick={() => setActiveNav(item.label)}
                className={`flex flex-col items-center justify-center gap-1 transition ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-blue-500'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-xs font-semibold">{item.label}</span>
              </a>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
