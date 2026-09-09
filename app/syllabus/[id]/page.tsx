import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { ChevronRight, BookOpen, FileText, CheckCircle2, ChevronDown } from 'lucide-react'

const syllabi: Record<string, any> = {
  "1": {
    id: "1",
    title: "SSC CGL Syllabus 2024",
    organization: "Staff Selection Commission",
    examName: "Combined Graduate Level",
    qualification: "Graduate",
    updatedOn: "01 Jan 2024",
    category: "Central Govt",
    officialUrl: "https://ssc.nic.in",
    tiers: [
      {
        name: "Tier 1 — Computer Based Examination",
        totalQuestions: 100,
        totalMarks: 200,
        duration: "60 Minutes",
        subjects: [
          { name: "General Intelligence & Reasoning", questions: 25, marks: 50, topics: ["Analogies", "Similarities", "Space Visualization", "Problem Solving", "Analysis", "Judgment", "Decision Making", "Visual Memory", "Discrimination", "Observation"] },
          { name: "General Awareness", questions: 25, marks: 50, topics: ["Current Affairs", "India & Neighbors", "History", "Culture", "Geography", "Economic Scene", "General Polity", "Scientific Research"] },
          { name: "Quantitative Aptitude", questions: 25, marks: 50, topics: ["Number System", "Computation of Whole Numbers", "Decimals & Fractions", "Ratio & Proportion", "Percentage", "Average", "Interest", "Profit & Loss", "Discount", "Time & Distance", "Algebra", "Geometry", "Trigonometry"] },
          { name: "English Comprehension", questions: 25, marks: 50, topics: ["Spot the Error", "Fill in the Blanks", "Synonyms/Antonyms", "Spelling", "Idioms & Phrases", "One Word Substitution", "Improvement of Sentences", "Comprehension Passage"] },
        ]
      },
      {
        name: "Tier 2 — Computer Based Examination",
        totalQuestions: 390,
        totalMarks: 390,
        duration: "Multiple Sessions",
        subjects: [
          { name: "Mathematical Abilities", questions: 90, marks: 180, topics: ["Number Systems", "Algebra", "Geometry", "Mensuration", "Statistics", "Trigonometry"] },
          { name: "Reasoning & General Intelligence", questions: 90, marks: 180, topics: ["Verbal & Non-verbal Reasoning", "Coding-Decoding", "Matrix", "Blood Relations"] },
          { name: "English Language & Comprehension", questions: 150, marks: 150, topics: ["Reading Comprehension", "Grammar", "Vocabulary", "Writing Skills"] },
          { name: "General Awareness", questions: 60, marks: 60, topics: ["Current Events", "History", "Geography", "Economy", "Science"] },
        ]
      }
    ]
  },
  "2": {
    id: "2",
    title: "SSC CHSL Syllabus 2024",
    organization: "Staff Selection Commission",
    examName: "Combined Higher Secondary Level",
    qualification: "12th Pass",
    updatedOn: "01 Jan 2024",
    category: "Central Govt",
    officialUrl: "https://ssc.nic.in",
    tiers: [
      {
        name: "Tier 1 — Computer Based Examination",
        totalQuestions: 100,
        totalMarks: 200,
        duration: "60 Minutes",
        subjects: [
          { name: "General Intelligence", questions: 25, marks: 50, topics: ["Semantic Analogy", "Symbolic Operations", "Venn Diagrams", "Drawing Inferences", "Punched Hole/Pattern"] },
          { name: "General Awareness", questions: 25, marks: 50, topics: ["Current Affairs", "India & World", "History", "Culture", "Geography", "Polity", "Science & Technology"] },
          { name: "Quantitative Aptitude", questions: 25, marks: 50, topics: ["Number System", "Percentage", "Ratio", "Average", "Interest", "Profit & Loss", "Time & Work", "Mensuration"] },
          { name: "English Language", questions: 25, marks: 50, topics: ["Reading Comprehension", "Cloze Test", "Para Jumbles", "Error Spotting", "Fill in the Blanks"] },
        ]
      }
    ]
  },
  "3": {
    id: "3",
    title: "Bihar Police Constable Syllabus 2024",
    organization: "Bihar Police",
    examName: "Bihar Police Constable",
    qualification: "12th Pass",
    updatedOn: "15 Feb 2024",
    category: "State Govt",
    officialUrl: "https://csbc.bih.nic.in",
    tiers: [
      {
        name: "Written Examination",
        totalQuestions: 100,
        totalMarks: 100,
        duration: "120 Minutes",
        subjects: [
          { name: "General Knowledge", questions: 40, marks: 40, topics: ["Current Affairs", "History of Bihar", "Geography", "Polity", "Economy", "Science & Technology"] },
          { name: "Hindi", questions: 25, marks: 25, topics: ["Grammar", "Comprehension", "Vocabulary", "Essay Writing"] },
          { name: "Mathematics", questions: 25, marks: 25, topics: ["Number System", "Percentage", "Ratio", "Average", "Profit & Loss", "Time & Work"] },
          { name: "Science", questions: 10, marks: 10, topics: ["Physics Basics", "Chemistry Basics", "Biology Basics"] },
        ]
      }
    ]
  },
}

export default async function SyllabusDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const syllabus = syllabi[id]

  if (!syllabus) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-700">Syllabus Not Found</h1>
          <a href="/syllabus" className="text-blue-600 hover:underline mt-4 block">Back to Syllabus</a>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      <Header />

      {/* Page header */}
      <div className="bg-blue-900 text-white py-4 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1 text-xs text-blue-200 mb-3">
            <a href="/" className="hover:text-white">Home</a>
            <ChevronRight className="w-3 h-3" />
            <a href="/syllabus" className="hover:text-white">Syllabus</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{syllabus.examName}</span>
          </div>
          <h1 className="text-xl font-bold">{syllabus.title}</h1>
          <p className="text-blue-200 text-sm mt-1">{syllabus.organization}</p>
          <div className="flex flex-wrap gap-4 mt-2 text-xs text-blue-200">
            <span>🎓 {syllabus.qualification}</span>
            <span>🏷️ {syllabus.category}</span>
            <span>📅 Updated: {syllabus.updatedOn}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">

        {/* Tiers */}
        {syllabus.tiers.map((tier: any, ti: number) => (
          <div key={ti} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {tier.name}
            </h2>

            {/* Tier summary */}
            <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-600 bg-blue-50 rounded-lg p-2 border border-blue-100">
              <span>📝 Total Questions: <strong className="text-blue-900">{tier.totalQuestions}</strong></span>
              <span>🎯 Total Marks: <strong className="text-blue-900">{tier.totalMarks}</strong></span>
              <span>⏱️ Duration: <strong className="text-blue-900">{tier.duration}</strong></span>
            </div>

            {/* Subjects table */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left py-1.5 px-2 text-gray-600 font-semibold">Subject</th>
                    <th className="text-center py-1.5 text-gray-600 font-semibold">Questions</th>
                    <th className="text-center py-1.5 text-gray-600 font-semibold">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {tier.subjects.map((subject: any, si: number) => (
                    <tr key={si} className="border-b border-gray-50 hover:bg-blue-50">
                      <td className="py-1.5 px-2 text-blue-900 font-medium">{subject.name}</td>
                      <td className="py-1.5 text-center text-gray-700">{subject.questions}</td>
                      <td className="py-1.5 text-center text-gray-700">{subject.marks}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 border-t-2 border-gray-200">
                    <td className="py-1.5 px-2 font-black text-gray-700">Total</td>
                    <td className="py-1.5 text-center font-black text-blue-900">{tier.totalQuestions}</td>
                    <td className="py-1.5 text-center font-black text-blue-900">{tier.totalMarks}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Topics per subject */}
            <div className="space-y-2">
              {tier.subjects.map((subject: any, si: number) => (
                <details key={si} className="border border-gray-100 rounded-lg group">
                  <summary className="flex items-center justify-between px-3 py-2 cursor-pointer list-none">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-semibold text-gray-800">{subject.name}</span>
                      <span className="text-xs text-gray-400">({subject.questions} Questions • {subject.marks} Marks)</span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-3 pb-3">
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {subject.topics.map((topic: string, ti: number) => (
                        <span key={ti} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-2.5 h-2.5 text-green-500" /> {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Official Source */}
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
          <h2 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" /> Official Source
          </h2>
          <p className="text-xs text-gray-600 mb-2">Always verify the syllabus from the official website before preparing.</p>
          <a href={syllabus.officialUrl} target="_blank" className="text-xs text-blue-700 font-semibold hover:underline">
            Visit Official Website →
          </a>
        </div>

        <a href="/syllabus" className="block text-center text-xs text-blue-600 hover:underline">← Back to All Syllabus</a>
      </div>

      <Footer />
    </main>
  )
}