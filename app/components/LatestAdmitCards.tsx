const admitCards = [
  {
    id: 1,
    title: "SSC CGL Admit Card 2024",
    organization: "Staff Selection Commission",
    examDate: "15 Nov 2024",
    releaseDate: "01 Nov 2024",
    status: "Available",
  },
  {
    id: 2,
    title: "UPSC Civil Services Admit Card 2024",
    organization: "Union Public Service Commission",
    examDate: "26 May 2024",
    releaseDate: "10 May 2024",
    status: "Available",
  },
  {
    id: 3,
    title: "Railway RRB NTPC Admit Card 2024",
    organization: "Railway Recruitment Board",
    examDate: "Awaited",
    releaseDate: "Awaited",
    status: "Awaited",
  },
  {
    id: 4,
    title: "Bihar Police Admit Card 2024",
    organization: "Bihar Police",
    examDate: "Dec 2024",
    releaseDate: "Nov 2024",
    status: "Awaited",
  },
]

export default function LatestAdmitCards() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      {/* Section header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">🪪 Latest Admit Cards</h2>
        <a href="/admit-card" className="text-sm text-blue-700 font-medium hover:underline">
          View All Admit Cards →
        </a>
      </div>

      {/* Admit card cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {admitCards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-800 text-sm">{card.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                card.status === "Available"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {card.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{card.organization}</p>
            <div className="text-xs text-gray-600 mb-3 space-y-1">
              <p>📅 Exam Date: <strong>{card.examDate}</strong></p>
              <p>🗓️ Release Date: <strong>{card.releaseDate}</strong></p>
            </div>
            <a href={`/admit-card/${card.id}`} className="block text-center bg-purple-600 text-white text-xs py-1.5 rounded hover:bg-purple-500">
              Download Admit Card
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}