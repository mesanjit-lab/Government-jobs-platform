import type { Metadata } from 'next'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Job Alerts — Planned Feature | MyResult',
  description: 'Learn about planned MyResult recruitment alerts. Subscriptions and personalized notifications are not available yet.',
}

export default function AlertsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bell className="w-5 h-5" aria-hidden="true" /> MyResult Job Alerts
          </h1>
          <p className="text-blue-200 text-sm mt-1">A planned feature for recruitment-specific updates</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <span className="inline-block text-xs font-semibold bg-blue-50 text-blue-700 rounded-full px-3 py-1">Not available yet</span>
          <h2 className="text-sm font-bold text-blue-900 mt-3 mb-2">About the planned feature</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            MyResult plans to offer alerts for updates to the recruitments you follow.
            Personalized notifications, subscriptions, and notification preferences are not implemented.
            This page is informational only; it does not sign you up or send alerts.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-blue-900 mb-3">Updates planned for future alerts</h2>
          <ul className="list-disc pl-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <li>Application dates</li>
            <li>Exam dates</li>
            <li>Admit cards</li>
            <li>Answer keys</li>
            <li>Results</li>
          </ul>
        </section>

        <section className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h2 className="text-sm font-bold text-blue-900 mb-2">Browse without an account</h2>
          <p className="text-sm text-gray-700 mb-4">
            You can browse the existing pages now. Always verify recruitment dates and details with the official recruitment authority.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/jobs" className="inline-flex min-h-11 items-center bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-600">Browse Jobs</Link>
            <Link href="/exam-calendar" className="inline-flex min-h-11 items-center border border-blue-700 text-blue-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-100">Exam Calendar</Link>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
