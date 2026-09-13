'use client'
import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ChevronRight, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please fill all fields.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Login feature coming soon! We are setting up authentication.')
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
            <span className="text-white">Login</span>
          </div>
          <h1 className="text-xl font-bold">Welcome Back!</h1>
          <p className="text-blue-200 text-sm mt-1">Login to get job alerts and notifications</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8 space-y-4">

        {/* Info banner */}
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
          <p className="text-xs text-blue-700">
            <strong>Note:</strong> Login is optional. You can browse all jobs, results, admit cards and use all tools without logging in. Login is only required to receive job notifications and alerts.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-blue-900 mb-4">Login to MyResult</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                <div className="px-3 py-2 bg-gray-50">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input type="email" placeholder="Enter your email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm outline-none bg-white" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                <div className="px-3 py-2 bg-gray-50">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm outline-none bg-white" />
                <button onClick={() => setShowPassword(!showPassword)} className="px-3 py-2">
                  {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs text-blue-600 hover:underline">Forgot Password?</a>
            </div>

            <button onClick={handleLogin} disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-600 disabled:opacity-60">
              {loading ? '⏳ Logging in...' : 'Login'}
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400">or</span>
              </div>
            </div>

            {/* Google Login */}
            <button className="w-full border-2 border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
              <span className="text-lg">G</span> Continue with Google
            </button>
          </div>
        </div>

        {/* Register link */}
        <div className="text-center">
          <p className="text-xs text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 font-semibold hover:underline">Register Free</a>
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-xs font-bold text-blue-900 mb-3">Why Create an Account?</h3>
          <div className="space-y-2">
            {[
              "🔔 Get instant job alerts on WhatsApp, Email & SMS",
              "📌 Save and track your favorite jobs",
              "📅 Never miss application deadlines",
              "🎯 Get personalized job recommendations",
              "📊 Track your applied jobs and exam dates",
            ].map((benefit, i) => (
              <p key={i} className="text-xs text-gray-600">{benefit}</p>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </main>
  )
}