const admitCards = [
  { id: 1, title: "RRB NTPC Admit Card 2024", examDate: "15 May 2024", status: "Available" },
  { id: 2, title: "SSC CHSL Admit Card 2024", examDate: "20 May 2024", status: "Available" },
  { id: 3, title: "Bihar Police Admit Card 2024", examDate: "25 May 2024", status: "Available" },
  { id: 4, title: "UPSSSC PET Admit Card 2024", examDate: "10 Jun 2024", status: "Available" },
  { id: 5, title: "SSC CGL Admit Card 2024", examDate: "20 Jun 2024", status: "Awaited" },
]

export default function LatestAdmitCards() {
  return (
    <div className="bg-white rounded-xl shadow p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold text-gray-800">🪪 Latest Admit Cards</h2>
        <a href="/admit-card" className="text-xs text-blue-600 hover:underline">View All</a>
      </div>
      <div className="space-y-1.5">
        {admitCards.map((card) => (
          <a href={"/admit-card/" + card.id} key={card.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-2 py-1.5 hover:bg-purple-50 transition">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-gray-800 truncate block">{card.title}</span>
              <span className="text-xs text-gray-400">Exam: {card.examDate}</span>
            </div>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ml-2 font-medium whitespace-nowrap ${
              card.status === "Available" ? "bg-green-100 text-green-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>{card.status}</span>
          </a>
        ))}
      </div>
      <a href="/admit-card" className="block text-center text-xs text-blue-600 mt-2 hover:underline">View All Admit Cards →</a>
    </div>
  )
}