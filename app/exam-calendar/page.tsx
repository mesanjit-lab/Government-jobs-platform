import Header from '../components/Header'
import Footer from '../components/Footer'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'

const exams = [
  {
    id: 1, title: "SSC CGL Tier 1 2024", organization: "Staff Selection Commission",
    examDate: "15 Jun 2024", city: "All India", qualification: "Graduate",
    category: "Central Govt", status: "Upcoming", color: "blue"
  },
  {
    id: 2, title: "Bihar Police Constable Exam 2024", organization: "Bihar Police",
    examDate: "20 Jun 2024", city: "Bihar", qualification: "12th Pass",
    category: "State Govt", status: "Upcoming", color: "green"
  },
  {
    id: 3, title: "RRB NTPC CBT 1 2024", organization: "Indian Railways",
    examDate: "25 Jun 2024", city: "All India", qualification: "12th Pass",
    category: "Railway", status: "Upcoming", color: "orange"
  },
  {
    id: 4, title: "UPSC IAS Prelims 2024", organization: "UPSC",
    examDate: "26 May 2024", city: "All India", qualification: "Graduate",
    category: "Central Govt", status: "Completed", color: "gray"
  },
  {
    id: 5, title: "BPSC 70th Combined Exam", organization: "BPSC",
    examDate: "15 Jul 2024", city: "Bihar", qualification: "Graduate",
    category: "State Govt", status: "Upcoming", color: "blue"
  },
  {
    id: 6, title: "SSC CHSL Tier 1 2024", organization: "Staff Selection Commission",
    examDate: "20 May 2024", city: "All India", qualification: "12th Pass",
    category: "Central Govt", status: "Completed", color: "gray"
  },
  {
    id: 7, title: "RRB Group D 2024", organization: "Indian Railways",
    examDate: "Aug 2024", city: "All India", qualification: "10th Pass",
    category: "Railway", status: "Upcoming", color: "orange"
  },
  {
    id: 8, title: "UPSSSC PET 2024", organization: "UPSSSC",
    examDate: "30 Jun 2024", city: "Uttar Pradesh", qualification: "12th Pass",
    category: "State Govt", status: "Upcoming", color: "green"
  },
  {
    id: 9, title: "IBPS PO 2024", organization: "IBPS",
    examDate: "Oct 2024", city: "All India", qualification: "Graduate",
    category: "Bank", status: "Upcoming", color: "purple"
  },
  {
    id: 10, title: "SBI Clerk 2024", organization: "State Bank of India",
    examDate: "Sep 2024", city: "All India", qualification: "Graduate",
    category: "Bank", status: "Upcoming", color: "purple"
  },
]

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function ExamCalendarPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Page header */}
      <div className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">Exam Calendar 2024</h1>
          <p className="text-blue-200 text-sm mt-1">Complete schedule of upcoming government exams</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar filters */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Filter Exams</h2>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Month</label>
              <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50">
                <option value="">All Months</option>
                {months.map((m) => (
                  <option key={m}>{m} 2024</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
              <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50">
                <option value="">All</option>
                <option>Central Govt</option>
                <option>State Govt</option>
                <option>Railway</option>
                <option>Bank</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50">
                <option value="">All</option>
                <option>Upcoming</option>
                <option>Completed</option>
              </select>
            </div>

            <button className="w-full bg-blue-700 text-white py-2 rounded text-xs font-semibold hover:bg-blue-600">
              Apply Filters
            </button>
          </div>

          {/* Month wise quick links */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Quick Month</h2>
            <div className="grid grid-cols-3 gap-1">
              {months.map((m) => (
                <button key={m} className="text-xs py-1.5 px-2 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition">
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Exam list */}
        <div className="lg:col-span-3 space-y-4">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl shadow p-3 text-center">
              <div className="text-xl font-black text-blue-900">{exams.filter(e => e.status === "Upcoming").length}</div>
              <div className="text-xs text-gray-500">Upcoming Exams</div>
            </div>
            <div className="bg-white rounded-xl shadow p-3 text-center">
              <div className="text-xl font-black text-green-700">{exams.filter(e => e.status === "Completed").length}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="bg-white rounded-xl shadow p-3 text-center">
              <div className="text-xl font-black text-blue-900">{exams.length}</div>
              <div className="text-xs text-gray-500">Total Exams</div>
            </div>
          </div>

          {/* Exam cards */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-800">All Exams ({exams.length})</h2>
              <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none">
                <option>Date: Nearest First</option>
                <option>Date: Latest First</option>
              </select>
            </div>

            <div className="space-y-3">
              {exams.map((exam) => (
                <div key={exam.id} className={`border rounded-lg p-3 ${
                  exam.status === "Completed" ? "border-gray-100 bg-gray-50" : "border-gray-100 hover:bg-blue-50"
                } transition`}>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 flex-1">
                      {/* Date badge */}
                      <div className={`min-w-12 text-center rounded-lg p-1.5 flex-shrink-0 ${
                        exam.status === "Completed" ? "bg-gray-200" : "bg-blue-700"
                      }`}>
                        <div className={`text-xs font-bold ${exam.status === "Completed" ? "text-gray-600" : "text-white"}`}>
                          {exam.examDate.split(" ")[0]}
                        </div>
                        <div className={`text-xs ${exam.status === "Completed" ? "text-gray-500" : "text-blue-200"}`}>
                          {exam.examDate.split(" ")[1] || ""}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-sm font-bold ${exam.status === "Completed" ? "text-gray-500" : "text-blue-900"}`}>
                          {exam.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{exam.organization}</p>
                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-600">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{exam.examDate}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{exam.city}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{exam.qualification}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                        exam.status === "Upcoming" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>{exam.status}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                        exam.category === "Central Govt" ? "bg-blue-50 text-blue-600" :
                        exam.category === "State Govt" ? "bg-green-50 text-green-600" :
                        exam.category === "Railway" ? "bg-orange-50 text-orange-600" :
                        "bg-purple-50 text-purple-600"
                      }`}>{exam.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  )
}