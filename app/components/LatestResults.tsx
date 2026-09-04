const results = [
  {
    id: 1,
    title: "SSC CGL Result 2024",
    organization: "Staff Selection Commission",
    resultDate: "15 Oct 2024",
    status: "Out",
  },
  {
    id: 2,
    title: "UPSC Civil Services Result 2024",
    organization: "Union Public Service Commission",
    resultDate: "20 Sep 2024",
    status: "Out",
  },
  {
    id: 3,
    title: "Railway RRB NTPC Result 2024",
    organization: "Railway Recruitment Board",
    resultDate: "Awaited",
    status: "Awaited",
  },
  {
    id: 4,
    title: "Bihar Police Constable Result 2024",
    organization: "Bihar Police",
    resultDate: "Awaited",
    status: "Awaited",
  },
]

export default function LatestResults() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      {/* Section header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">📊 Latest Results</h2>
        <a href="/results" className="text-sm text-blue-700 font-medium hover:underline">
          View All Results →
        </a>
      </div>

      {/* Result cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((result) => (
          <div key={result.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-800 text-sm">{result.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                result.status === "Out"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {result.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{result.organization}</p>
            <p className="text-xs text-gray-600 mb-3">📅 Result Date: <strong>{result.resultDate}</strong></p>
            <a href={`/results/${result.id}`} className="block text-center bg-green-600 text-white text-xs py-1.5 rounded hover:bg-green-500">
              View Result
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}