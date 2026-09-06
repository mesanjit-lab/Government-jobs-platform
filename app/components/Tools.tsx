const tools = [
  { title: "Exam Calendar", subtitle: "View All Exams", icon: "📅", href: "/exam-calendar" },
  { title: "Syllabus", subtitle: "Exam Syllabus", icon: "📋", href: "/syllabus" },
  { title: "Eligibility Check", subtitle: "Check Now", icon: "✅", href: "/tools/eligibility" },
  { title: "Age Calculator", subtitle: "Calculate Age", icon: "🎂", href: "/tools/age-calculator" },
  { title: "Photo & Sign", subtitle: "Resize Tools", icon: "🖼️", href: "/tools/photo" },
  { title: "PDF Tools", subtitle: "All PDF Tools", icon: "📄", href: "/tools/pdf" },
  { title: "Join Telegram", subtitle: "Get Updates", icon: "✈️", href: "#" },
  { title: "Job Alerts", subtitle: "Never Miss Jobs", icon: "🔔", href: "/alerts" },
]

export default function Tools() {
  return (
    <section className="bg-white border-t border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
          {tools.map((tool) => (
            <a key={tool.title} href={tool.href} className="flex flex-col items-center text-center p-3 rounded-lg hover:bg-blue-50 transition">
              <span className="text-2xl mb-1">{tool.icon}</span>
              <span className="text-xs font-semibold text-gray-800">{tool.title}</span>
              <span className="text-xs text-gray-500">{tool.subtitle}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}