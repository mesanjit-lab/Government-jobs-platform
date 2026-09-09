import Header from '../components/Header'
import Footer from '../components/Footer'

const admitCards = [
  { id: 1, title: "RRB NTPC Admit Card 2024", organization: "Indian Railways", examDate: "15 May 2024", releaseDate: "01 May 2024", examName: "RRB NTPC", status: "Available", category: "Railway" },
  { id: 2, title: "SSC CHSL Admit Card 2024", organization: "Staff Selection Commission", examDate: "20 May 2024", releaseDate: "05 May 2024", examName: "SSC CHSL", status: "Available", category: "Central Govt" },
  { id: 3, title: "Bihar Police Admit Card 2024", organization: "Bihar Police", examDate: "25 May 2024", releaseDate: "10 May 2024", examName: "Bihar Police Constable", status: "Available", category: "State Govt" },
  { id: 4, title: "UPSSSC PET Admit Card 2024", organization: "UPSSSC", examDate: "10 Jun 2024", releaseDate: "25 May 2024", examName: "UPSSSC PET", status: "Available", category: "State Govt" },
  { id: 5, title: "SSC CGL Admit Card 2024", organization: "Staff Selection Commission", examDate: "20 Jun 2024", releaseDate: "Awaited", examName: "SSC CGL", status: "Awaited", category: "Central Govt" },
  { id: 6, title: "BPSC 70th Admit Card 2024", organization: "BPSC", examDate: "Jul 2024", releaseDate: "Awaited", examName: "BPSC 70th", status: "Awaited", category: "State Govt" },
  { id: 7, title: "RRB Group D Admit Card 2024", organization: "Indian Railways", examDate: "Aug 2024", releaseDate: "Awaited", examName: "RRB Group D", status: "Awaited", category: "Railway" },
  { id: 8, title: "UPSC IAS Admit Card 2024", organization: "UPSC", examDate: "26 May 2024", releaseDate: "10 May 2024", examName: "Civil Services", status: "Available", category: "Central Govt" },
]

export default function AdmitCardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Page header */}
      <div className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">Latest Admit Cards 2024</h1>
          <p className="text-blue-200 text-sm mt-1">Download latest sarkari exam admit cards and hall tickets</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Filter Admit Cards</h2>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50">
                <option value="">All</option>
                <option>Available</option>
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

        {/* Admit Cards list */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-800">All Admit Cards ({admitCards.length})</h2>
              <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none">
                <option>Latest First</option>
                <option>Exam Date</option>
              </select>
            </div>

            <div className="space-y-3">
              {admitCards.map((card) => (
                <a href={"/admit-card/" + card.id} key={card.id} className="block border border-gray-100 rounded-lg p-3 hover:bg-purple-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-blue-900">{card.title}</h3>
                      <p className="text-xs text-gray-600 font-medium mt-0.5">{card.organization}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2 ${
                      card.status === "Available" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>{card.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                    <span>📋 {card.examName}</span>
                    <span>🏷️ {card.category}</span>
                    <span className="text-blue-600">📅 Exam Date: <strong>{card.examDate}</strong></span>
                    <span className="text-purple-600">🗓️ Release Date: <strong>{card.releaseDate}</strong></span>
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