import Header from '../components/Header'
import Footer from '../components/Footer'

const results = [
  { id: 1, title: "SSC CGL 2023 Final Result", organization: "Staff Selection Commission", declaredOn: "07 May 2024", examName: "Combined Graduate Level", status: "Declared", category: "Central Govt" },
  { id: 2, title: "Bihar Police Constable Result 2023", organization: "Bihar Police", declaredOn: "05 May 2024", examName: "Bihar Police Constable", status: "Declared", category: "State Govt" },
  { id: 3, title: "Railway NTPC CBT 2 Result", organization: "Indian Railways", declaredOn: "03 May 2024", examName: "RRB NTPC", status: "Declared", category: "Railway" },
  { id: 4, title: "UPPCL JE Result 2023", organization: "UPPCL", declaredOn: "01 May 2024", examName: "Junior Engineer", status: "Declared", category: "State Govt" },
  { id: 5, title: "SSC MTS 2023 Result", organization: "Staff Selection Commission", declaredOn: "30 Apr 2024", examName: "Multi Tasking Staff", status: "Declared", category: "Central Govt" },
  { id: 6, title: "BPSC 69th Result", organization: "BPSC", declaredOn: "Awaited", examName: "69th Combined Exam", status: "Awaited", category: "State Govt" },
  { id: 7, title: "UPSC IAS Final Result 2023", organization: "UPSC", declaredOn: "25 Apr 2024", examName: "Civil Services", status: "Declared", category: "Central Govt" },
  { id: 8, title: "RRB Group D Result 2024", organization: "Indian Railways", declaredOn: "Awaited", examName: "Group D", status: "Awaited", category: "Railway" },
]

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Page header */}
      <div className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">Latest Government Results 2024</h1>
          <p className="text-blue-200 text-sm mt-1">Check latest sarkari exam results and merit lists</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Filter Results</h2>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50">
                <option value="">All</option>
                <option>Declared</option>
                <option>Awaited</option>
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

        {/* Results list */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-800">All Results ({results.length})</h2>
              <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none">
                <option>Latest First</option>
                <option>Oldest First</option>
              </select>
            </div>

            <div className="space-y-3">
              {results.map((result) => (
                <a href={"/results/" + result.id} key={result.id} className="block border border-gray-100 rounded-lg p-3 hover:bg-green-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-blue-900">{result.title}</h3>
                      <p className="text-xs text-gray-600 font-medium mt-0.5">{result.organization}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2 ${
                      result.status === "Declared" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>{result.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                    <span>📋 {result.examName}</span>
                    <span>🏷️ {result.category}</span>
                    <span className="text-green-600">📅 Declared: <strong>{result.declaredOn}</strong></span>
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