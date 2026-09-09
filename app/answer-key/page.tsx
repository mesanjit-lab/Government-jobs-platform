import Header from '../components/Header'
import Footer from '../components/Footer'

const answerKeys = [
  { id: 1, title: "SSC CGL Tier 1 Answer Key 2024", organization: "Staff Selection Commission", releaseDate: "06 May 2024", objectionStart: "07 May 2024", objectionEnd: "10 May 2024", examName: "SSC CGL", status: "Released", category: "Central Govt" },
  { id: 2, title: "Railway Group D Answer Key 2024", organization: "Indian Railways", releaseDate: "04 May 2024", objectionStart: "05 May 2024", objectionEnd: "08 May 2024", examName: "RRB Group D", status: "Released", category: "Railway" },
  { id: 3, title: "SSC CHSL Tier 1 Answer Key 2024", organization: "Staff Selection Commission", releaseDate: "02 May 2024", objectionStart: "03 May 2024", objectionEnd: "06 May 2024", examName: "SSC CHSL", status: "Released", category: "Central Govt" },
  { id: 4, title: "UPSSSC PET Answer Key 2024", organization: "UPSSSC", releaseDate: "Awaited", objectionStart: "Awaited", objectionEnd: "Awaited", examName: "UPSSSC PET", status: "Awaited", category: "State Govt" },
  { id: 5, title: "BPSC 70th Answer Key 2024", organization: "BPSC", releaseDate: "Awaited", objectionStart: "Awaited", objectionEnd: "Awaited", examName: "BPSC 70th", status: "Awaited", category: "State Govt" },
  { id: 6, title: "RRB NTPC Answer Key 2024", organization: "Indian Railways", releaseDate: "01 May 2024", objectionStart: "02 May 2024", objectionEnd: "05 May 2024", examName: "RRB NTPC", status: "Released", category: "Railway" },
  { id: 7, title: "UPSC IAS Prelims Answer Key 2024", organization: "UPSC", releaseDate: "Awaited", objectionStart: "Awaited", objectionEnd: "Awaited", examName: "Civil Services Prelims", status: "Awaited", category: "Central Govt" },
  { id: 8, title: "Bihar Police Answer Key 2024", organization: "Bihar Police", releaseDate: "Awaited", objectionStart: "Awaited", objectionEnd: "Awaited", examName: "Bihar Police Constable", status: "Awaited", category: "State Govt" },
]

export default function AnswerKeyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Page header */}
      <div className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">Latest Answer Keys 2024</h1>
          <p className="text-blue-200 text-sm mt-1">Download latest sarkari exam answer keys and raise objections</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Filter Answer Keys</h2>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50">
                <option value="">All</option>
                <option>Released</option>
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

        {/* Answer Keys list */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-800">All Answer Keys ({answerKeys.length})</h2>
              <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none">
                <option>Latest First</option>
                <option>Oldest First</option>
              </select>
            </div>

            <div className="space-y-3">
              {answerKeys.map((key) => (
                <a href={"/answer-key/" + key.id} key={key.id} className="block border border-gray-100 rounded-lg p-3 hover:bg-orange-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-blue-900">{key.title}</h3>
                      <p className="text-xs text-gray-600 font-medium mt-0.5">{key.organization}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2 ${
                      key.status === "Released" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>{key.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                    <span>📋 {key.examName}</span>
                    <span>🏷️ {key.category}</span>
                    <span className="text-green-600">📅 Released: <strong>{key.releaseDate}</strong></span>
                    <span className="text-red-500">⚠️ Objection: <strong>{key.objectionStart}</strong> to <strong>{key.objectionEnd}</strong></span>
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