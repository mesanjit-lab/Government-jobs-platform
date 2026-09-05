const results = [
  { id: 1, title: "SSC CGL 2023 Final Result", declaredOn: "07 May 2024", status: "New" },
  { id: 2, title: "Bihar Police Constable Result 2023", declaredOn: "05 May 2024", status: "New" },
  { id: 3, title: "Railway NTPC CBT 2 Result", declaredOn: "03 May 2024", status: "New" },
  { id: 4, title: "UPPCL JE Result 2023", declaredOn: "01 May 2024", status: "Updated" },
  { id: 5, title: "SSC MTS 2023 Result", declaredOn: "30 Apr 2024", status: "Updated" },
]

export default function LatestResults() {
  return (
    <div className="bg-white rounded-xl shadow p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold text-gray-800">📊 Latest Results</h2>
        <a href="/results" className="text-xs text-blue-600 hover:underline">View All</a>
      </div>
      <div className="space-y-1.5">
        {results.map((result) => (
          <a href={"/results/" + result.id} key={result.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-2 py-1.5 hover:bg-green-50 transition">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-gray-800 truncate block">{result.title}</span>
              <span className="text-xs text-gray-400">Declared: {result.declaredOn}</span>
            </div>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ml-2 font-medium whitespace-nowrap ${
              result.status === "New" ? "bg-green-100 text-green-700" :
              "bg-blue-100 text-blue-700"
            }`}>{result.status}</span>
          </a>
        ))}
      </div>
      <a href="/results" className="block text-center text-xs text-blue-600 mt-2 hover:underline">View All Results →</a>
    </div>
  )
}