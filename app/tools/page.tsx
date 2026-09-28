import Header from '../components/Header'
import Footer from '../components/Footer'

const tools = [
  {
    id: "age-calculator",
    title: "Age Calculator",
    description: "Calculate your exact age in years, months and days. Check eligibility for government jobs.",
    icon: "🎂",
    category: "Calculator",
    href: "/tools/age-calculator"
  },
  {
    id: "eligibility-checker",
    title: "Eligibility Checker",
    description: "Check your eligibility for government jobs based on age, qualification and category.",
    icon: "✅",
    category: "Checker",
    href: "/tools/eligibility-checker"
  },
  {
    id: "photo-resize",
    title: "Photo & Signature Resize",
    description: "Resize your photo and signature as per government job application requirements.",
    icon: "🖼️",
    category: "Image Tool",
    href: "/tools/photo-resize"
  },
  {
    id: "pdf-tools",
    title: "PDF Tools",
    description: "Merge, split, compress and convert PDF files for government job applications.",
    icon: "📄",
    category: "PDF",
    href: "/tools/pdf"
  },
  {
    id: "exam-calendar",
    title: "Exam Calendar",
    description: "View complete schedule of upcoming government exams and important dates.",
    icon: "📅",
    category: "Calendar",
    href: "/exam-calendar"
  },
  {
    id: "syllabus",
    title: "Exam Syllabus",
    description: "Check detailed syllabus and exam pattern for all government exams.",
    icon: "📚",
    category: "Study",
    href: "/syllabus"
  },
]

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">Important Tools</h1>
          <p className="text-blue-200 text-sm mt-1">Useful tools for government job applications and exam preparation</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <a href={tool.href} key={tool.id}
              className="block bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{tool.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-blue-900">{tool.title}</h3>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{tool.category}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{tool.description}</p>
                  <div className="text-xs font-semibold mt-3 text-blue-600">Use Tool →</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}