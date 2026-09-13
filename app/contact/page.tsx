'use client'
import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ChevronRight, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!name || !email || !subject || !message) {
      alert('Please fill all fields.')
      return
    }
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-1 text-xs text-blue-200 mb-2">
            <a href="/" className="hover:text-white">Home</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Contact Us</span>
          </div>
          <h1 className="text-xl font-bold">Contact Us</h1>
          <p className="text-blue-200 text-sm mt-1">Get in touch with the MyResult team</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-900">Email Us</p>
              <p className="text-xs text-gray-600 mt-0.5">contact@myresult.in</p>
              <p className="text-xs text-gray-400">We reply within 24 hours</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-900">Telegram</p>
              <p className="text-xs text-gray-600 mt-0.5">@myresult_official</p>
              <p className="text-xs text-gray-400">Join for instant updates</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        {!submitted ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-blue-900 mb-4">Send Us a Message</h2>

            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name</label>
                  <input type="text" placeholder="Enter your name" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                  <input type="email" placeholder="Enter your email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50">
                  <option value="">Select Subject</option>
                  <option>Wrong Information / Error</option>
                  <option>Job Not Listed</option>
                  <option>Result Not Updated</option>
                  <option>Admit Card Issue</option>
                  <option>Tool Issue</option>
                  <option>Suggestion / Feedback</option>
                  <option>Advertise with Us</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                <textarea placeholder="Write your message here..." value={message}
                  onChange={(e) => setMessage(e.target.value)} rows={5}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 resize-none" />
              </div>

              <button onClick={handleSubmit}
                className="w-full bg-blue-700 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-600 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-green-700 mb-1">Message Sent!</h3>
            <p className="text-sm text-gray-600">Thank you for contacting us. We will get back to you within 24 hours.</p>
            <button onClick={() => { setSubmitted(false); setName(''); setEmail(''); setSubject(''); setMessage('') }}
              className="mt-4 text-xs text-blue-600 hover:underline">
              Send Another Message
            </button>
          </div>
        )}

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-blue-900 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {[
              { q: "How do I report wrong information?", a: "Use the contact form above and select 'Wrong Information / Error'. Provide the job/result name and the correct information." },
              { q: "How do I request a job to be added?", a: "Select 'Job Not Listed' in the subject and provide the official notification link." },
              { q: "How long does it take to get a reply?", a: "We usually reply within 24 hours on working days." },
              { q: "Can I advertise on MyResult?", a: "Yes! Select 'Advertise with Us' in the subject and we will share our advertising options." },
            ].map((faq, i) => (
              <details key={i} className="border border-gray-100 rounded-lg group">
                <summary className="flex justify-between items-center px-3 py-2 cursor-pointer list-none text-xs font-semibold text-gray-800">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-3 pb-2 text-xs text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </main>
  )
}