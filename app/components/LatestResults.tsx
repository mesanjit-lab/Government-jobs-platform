const results = [
  { id: 1, title: "SSC CGL 2023 Final Result", organization: "Staff Selection Commission", declaredOn: "07 May 2024", status: "New" },
  { id: 2, title: "Bihar Police Constable Result 2023", organization: "Bihar Police", declaredOn: "05 May 2024", status: "New" },
  { id: 3, title: "Railway NTPC CBT 2 Result", organization: "Indian Railways", declaredOn: "03 May 2024", status: "New" },
  { id: 4, title: "UPPCL JE Result 2023", organization: "UPPCL", declaredOn: "01 May 2024", status: "Updated" },
  { id: 5, title: "SSC MTS 2023 Result", organization: "Staff Selection Commission", declaredOn: "30 Apr 2024", status: "Updated" },
]

export default function LatestResults() {
  return (
    <div className="bg-white rounded-xl shadow p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold text-gray-800">📊 Latest Results</h2>
        <a href="/results" className="text-xs text-blue-600 hover:underline">View All</a>
      </div>

      {/* Result rows */}
      <div className="space-y-1">
        {results.map((result) => (
          <a href={"/results/" + result.id} key={result.id} className="grid grid-cols-12 items-center text-xs py-2 px-1 border-b border-gray-50 hover:bg-green-50 rounded transition">
            <div className="col-span-7">
              <div className="font-semibold text-blue-800 leading-tight">{result.title}</div>
              <div className="text-gray-600 text-xs font-medium">{result.organization}</div>
            </div>
            <span className="col-span-3 text-center text-gray-600">{result.declaredOn}</span>
            <div className="col-span-2 text-center">
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                result.status === "New" ? "bg-green-100 text-green-700" :
                "bg-blue-100 text-blue-700"
              }`}>{result.status}</span>
            </div>
          </a>
        ))}
      </div>

      <a href="/results" className="block text-center text-xs text-blue-600 mt-2 hover:underline">View All Results →</a>
    </div>
  )
}