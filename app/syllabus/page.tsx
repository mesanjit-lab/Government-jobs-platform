import Header from '../components/Header'
import Footer from '../components/Footer'

const syllabi = [
  { id: 1, title: "SSC CGL Syllabus 2024", organization: "Staff Selection Commission", examName: "Combined Graduate Level", updatedOn: "01 Jan 2024", qualification: "Graduate", category: "Central Govt", subjects: ["General Intelligence", "General Awareness", "Quantitative Aptitude", "English"] },
  { id: 2, title: "SSC CHSL Syllabus 2024", organization: "Staff Selection Commission", examName: "Combined Higher Secondary Level", updatedOn: "01 Jan 2024", qualification: "12th Pass", category: "Central Govt", subjects: ["General Intelligence", "English", "Quantitative Aptitude", "General Awareness"] },
  { id: 3, title: "Bihar Police Constable Syllabus 2024", organization: "Bihar Police", examName: "Bihar Police Constable", updatedOn: "15 Feb 2024", qualification: "12th Pass", category: "State Govt", subjects: ["General Knowledge", "Hindi", "Mathematics", "Science"] },
  { id: 4, title: "RRB NTPC Syllabus 2024", organization: "Indian Railways", examName: "RRB NTPC", updatedOn: "10 Jan 2024", qualification: "12th Pass / Graduate", category: "Railway", subjects: ["Mathematics", "General Intelligence", "General Awareness"] },
  { id: 5, title: "UPSC IAS Syllabus 2024", organization: "UPSC", examName: "Civil Services", updatedOn: "01 Dec 2023", qualification: "Graduate", category: "Central Govt", subjects: ["General Studies", "CSAT", "Optional Subject"] },
  { id: 6, title: "BPSC 70th Syllabus 2024", organization: "BPSC", examName: "BPSC 70th Combined", updatedOn: "20 Feb 2024", qualification: "Graduate", category: "State Govt", subjects: ["General Studies", "Optional Subject", "Hindi"] },
  { id: 7, title: "RRB Group D Syllabus 2024", organization: "Indian Railways", examName: "RRB Group D", updatedOn: "05 Jan 2024", qualification: "10th Pass", category: "Railway", subjects: ["Mathematics", "General Intelligence", "General Science", "General Awareness"] },
  { id: 8, title: "UPSSSC PET Syllabus 2024", organization: "UPSSSC", examName: "UPSSSC PET", updatedOn: "01 Mar 2024", qualification: "12th Pass", category: "State Govt", subjects: ["Indian History", "Geography", "Economics", "Science", "Mathematics", "Hindi", "English"] },
]

export default function SyllabusPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Page header */}
      <div className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">Government Exam Syllabus 2024</h1>
          <p className="text-blue-200 text-sm mt-1">Check latest exam syllabus and exam pattern for all government exams</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Filter Syllabus</h2>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Qualification</label>
              <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50">
                <option value="">All</option>
                <option>10th Pass</option>
                <option>12th Pass</option>
                <option>Graduate</option>
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

            <button className="w-full bg-blue-700 text-white py-2 rounded text-xs font-semibold hover:bg-blue-600">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Syllabus list */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-800">All Syllabus ({syllabi.length})</h2>
              <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none">
                <option>Latest First</option>
                <option>Oldest First</option>
              </select>
            </div>

            <div className="space-y-3">
              {syllabi.map((syllabus) => (
                <a href={"/syllabus/" + syllabus.id} key={syllabus.id} className="block border border-gray-100 rounded-lg p-3 hover:bg-blue-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-blue-900">{syllabus.title}</h3>
                      <p className="text-xs text-gray-600 font-medium mt-0.5">{syllabus.organization}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2 bg-blue-100 text-blue-700">
                      {syllabus.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                    <span>📋 {syllabus.examName}</span>
                    <span>🎓 {syllabus.qualification}</span>
                    <span className="text-blue-600">📅 Updated: <strong>{syllabus.updatedOn}</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {syllabus.subjects.map((subject, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{subject}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  )
}