const admitCards = [
  { id: 1, title: "RRB NTPC Admit Card 2024", organization: "Indian Railways", examDate: "15 May 2024", status: "Available" },
  { id: 2, title: "SSC CHSL Admit Card 2024", organization: "Staff Selection Commission", examDate: "20 May 2024", status: "Available" },
  { id: 3, title: "Bihar Police Admit Card 2024", organization: "Bihar Police", examDate: "25 May 2024", status: "Available" },
  { id: 4, title: "UPSSSC PET Admit Card 2024", organization: "UPSSSC", examDate: "10 Jun 2024", status: "Available" },
  { id: 5, title: "SSC CGL Admit Card 2024", organization: "Staff Selection Commission", examDate: "20 Jun 2024", status: "Awaited" },
]

export default function LatestAdmitCards() {
  return (
    <div className="bg-white rounded-xl shadow p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold text-gray-800">Latest Admit Cards</h2>
        <a href="/admit-card" className="text-xs text-blue-600 hover:underline">View All</a>
      </div>

      {/* Admit card rows */}
      <div className="space-y-1">
        {admitCards.map((card) => (
          <a href={"/admit-card/" + card.id} key={card.id} className="grid grid-cols-12 items-center text-xs py-2 px-1 border-b border-gray-50 hover:bg-purple-50 rounded transition">
            <div className="col-span-7">
             <div className="font-semibold text-blue-800 leading-tight">{card.title}</div>
              <div className="text-gray-600 text-xs font-medium">{card.organization}</div>
            </div>
            <span className="col-span-3 text-center text-gray-600">{card.examDate}</span>
            <div className="col-span-2 text-center">
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                card.status === "Available" ? "bg-green-100 text-green-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {card.status === "Available" ? "⬇" : "Soon"}
              </span>
            </div>
          </a>
        ))}
      </div>

      <a href="/admit-card" className="block text-center text-xs text-blue-600 mt-2 hover:underline">View All Admit Cards →</a>
    </div>
    
  )
}