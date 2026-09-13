import Header from '../components/Header'
import Footer from '../components/Footer'
import { ChevronRight, CheckCircle2, Users, Target, Shield } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-1 text-xs text-blue-200 mb-2">
            <a href="/" className="hover:text-white">Home</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">About Us</span>
          </div>
          <h1 className="text-xl font-bold">About MyResult</h1>
          <p className="text-blue-200 text-sm mt-1">Your trusted government job information platform</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Mission */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" /> Our Mission
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            MyResult is dedicated to helping Indian students and job seekers discover government job opportunities, exam results, admit cards and important recruitment updates — all in one place. We believe every student deserves easy access to accurate and timely government job information.
          </p>
        </div>

        {/* What we offer */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: "Latest Government Jobs", desc: "Daily updated job notifications from central and state governments" },
              { title: "Exam Results", desc: "Quick access to latest sarkari exam results and merit lists" },
              { title: "Admit Cards", desc: "Download hall tickets and admit cards for upcoming exams" },
              { title: "Answer Keys", desc: "Official answer keys and objection window information" },
              { title: "Exam Syllabus", desc: "Detailed syllabus and exam pattern for all government exams" },
              { title: "Exam Calendar", desc: "Complete schedule of upcoming government examinations" },
              { title: "Useful Tools", desc: "Age calculator, eligibility checker, photo resize and PDF tools" },
              { title: "Free Service", desc: "All information and tools are completely free for students" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-900">{item.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why MyResult */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" /> Why MyResult?
          </h2>
          <div className="space-y-3">
            {[
              { title: "Fast Updates", desc: "We update job notifications, results and admit cards as soon as they are released." },
              { title: "Reliable Information", desc: "All information is sourced from official government websites and notifications." },
              { title: "Mobile Friendly", desc: "Our website is fully optimized for mobile phones — no app download needed." },
              { title: "Student Focused", desc: "Designed specifically for Indian students preparing for government exams." },
              { title: "Free Tools", desc: "Photo resize, age calculator, PDF tools and eligibility checker — all free." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50">
                <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                <div>
                  <p className="text-xs font-bold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: "500+", label: "Active Jobs" },
            { value: "200+", label: "Results" },
            { value: "150+", label: "Admit Cards" },
            { value: "Daily", label: "Updates" },
          ].map((stat, i) => (
            <div key={i} className="bg-blue-700 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-xs text-blue-200 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4">
          <h3 className="text-xs font-bold text-yellow-800 mb-1">Disclaimer</h3>
          <p className="text-xs text-yellow-700">MyResult provides government job information for general informational purposes only. Candidates are advised to verify all details from the official recruitment notification and official website before applying. MyResult is not affiliated with any government organization.</p>
        </div>

      </div>

      <Footer />
    </main>
  )
}