'use client'
import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ChevronRight, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true, whatsapp: false, sms: false, push: true
  })

  const handleRegister = () => {
    if (!name || !email || !password) {
      alert('Please fill all required fields.')
      return
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Registration feature coming soon! We are setting up authentication.')
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-1 text-xs text-blue-200 mb-2">
            <a href="/" className="hover:text-white">Home</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Register</span>
          </div>
          <h1 className="text-xl font-bold">Create Free Account</h1>
          <p className="text-blue-200 text-sm mt-1">Get job alerts and never miss important updates</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8 space-y-4">

        {/* Info banner */}
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
          <p className="text-xs text-blue-700">
            <strong>Registration is optional.</strong> You can use all features of MyResult without an account. Register only if you want to receive job notifications and alerts.
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-blue-900 mb-4">Register for Free</h2>

          <div className="space-y-3">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name <span className="text-red-500">*</span></label>
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                <div className="px-3 py-2 bg-gray-50">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <input type="text" placeholder="Enter your full name" value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm outline-none bg-white" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address <span className="text-red-500">*</span></label>
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                <div className="px-3 py-2 bg-gray-50">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input type="email" placeholder="Enter your email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm outline-none bg-white" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Mobile Number <span className="text-gray-400 font-normal">(for WhatsApp/SMS alerts)</span>
              </label>
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                <div className="px-3 py-2 bg-gray-50 border-r border-gray-200">
                  <span className="text-xs text-gray-600 font-semibold">+91</span>
                </div>
                <div className="px-3 py-2 bg-gray-50">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <input type="tel" placeholder="10-digit mobile number" value={phone}
                  onChange={(e) => setPhone(e.target.value)} maxLength={10}
                  className="flex-1 px-3 py-2 text-sm outline-none bg-white" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password <span className="text-red-500">*</span></label>
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                <div className="px-3 py-2 bg-gray-50">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input type={showPassword ? 'text' : 'password'} placeholder="Minimum 6 characters" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm outline-none bg-white" />
                <button onClick={() => setShowPassword(!showPassword)} className="px-3 py-2">
                  {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <p className="text-xs font-bold text-blue-900 mb-2">🔔 Notification Preferences</p>
              <p className="text-xs text-gray-500 mb-2">How would you like to receive job alerts?</p>
              <div className="space-y-2">
                {[
                  { key: 'email', label: '📧 Email Notifications', desc: 'Get alerts on your email' },
                  { key: 'whatsapp', label: '💬 WhatsApp Alerts', desc: 'Get alerts on WhatsApp (requires mobile number)' },
                  { key: 'sms', label: '📱 SMS Alerts', desc: 'Get alerts via SMS (requires mobile number)' },
                  { key: 'push', label: '🔔 Push Notifications', desc: 'Get browser push notifications' },
                ].map((item) => (
                  <label key={item.key} className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                      className="mt-0.5 accent-blue-700" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleRegister} disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-600 disabled:opacity-60">
              {loading ? '⏳ Creating Account...' : '🚀 Create Free Account'}
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400">or</span>
              </div>
            </div>

            <button className="w-full border-2 border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
              <span className="text-lg">G</span> Continue with Google
            </button>

            <p className="text-xs text-gray-400 text-center">
              By registering, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:underline">Terms of Use</a>
              {' '}and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Login link */}
        <div className="text-center">
          <p className="text-xs text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 font-semibold hover:underline">Login Here</a>
          </p>
        </div>

      </div>

      <Footer />
    </main>
  )
}