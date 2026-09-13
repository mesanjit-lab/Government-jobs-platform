import Header from '../components/Header'
import Footer from '../components/Footer'
import { ChevronRight } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-1 text-xs text-blue-200 mb-2">
            <a href="/" className="hover:text-white">Home</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Privacy Policy</span>
          </div>
          <h1 className="text-xl font-bold">Privacy Policy</h1>
          <p className="text-blue-200 text-sm mt-1">Last updated: September 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">1. Introduction</h2>
            <p className="text-xs text-gray-700 leading-relaxed">Welcome to MyResult. We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, and protect information when you use our website myresult.in.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">2. Information We Collect</h2>
            <p className="text-xs text-gray-700 leading-relaxed mb-2">We may collect the following types of information:</p>
            <ul className="space-y-1 text-xs text-gray-700">
              <li className="flex items-start gap-2"><span className="text-blue-600 flex-shrink-0">•</span>Information you provide when contacting us (name, email, message)</li>
              <li className="flex items-start gap-2"><span className="text-blue-600 flex-shrink-0">•</span>Usage data such as pages visited, time spent, and browser type</li>
              <li className="flex items-start gap-2"><span className="text-blue-600 flex-shrink-0">•</span>Device information such as IP address and operating system</li>
              <li className="flex items-start gap-2"><span className="text-blue-600 flex-shrink-0">•</span>Cookies and similar tracking technologies</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">3. How We Use Your Information</h2>
            <ul className="space-y-1 text-xs text-gray-700">
              <li className="flex items-start gap-2"><span className="text-blue-600 flex-shrink-0">•</span>To provide and improve our services</li>
              <li className="flex items-start gap-2"><span className="text-blue-600 flex-shrink-0">•</span>To respond to your inquiries and messages</li>
              <li className="flex items-start gap-2"><span className="text-blue-600 flex-shrink-0">•</span>To send job alerts and notifications (only if you subscribe)</li>
              <li className="flex items-start gap-2"><span className="text-blue-600 flex-shrink-0">•</span>To analyze website traffic and improve user experience</li>
              <li className="flex items-start gap-2"><span className="text-blue-600 flex-shrink-0">•</span>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">4. PDF and Image Tools</h2>
            <p className="text-xs text-gray-700 leading-relaxed">Our PDF tools, Photo Resize tool and other document tools process files entirely in your browser. Your files are NOT uploaded to our servers. We do not store, access or share any files you process using our tools.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">5. Cookies</h2>
            <p className="text-xs text-gray-700 leading-relaxed">We use cookies to improve your browsing experience. Cookies help us remember your preferences and understand how you use our website. You can disable cookies in your browser settings, but some features may not work properly.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">6. Third Party Links</h2>
            <p className="text-xs text-gray-700 leading-relaxed">Our website contains links to official government websites and other third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read their privacy policies before providing any personal information.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">7. Data Security</h2>
            <p className="text-xs text-gray-700 leading-relaxed">We take reasonable measures to protect your information from unauthorized access, alteration, disclosure or destruction. However, no internet transmission is completely secure and we cannot guarantee absolute security.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">8. Children's Privacy</h2>
            <p className="text-xs text-gray-700 leading-relaxed">Our website is intended for users who are 13 years of age or older. We do not knowingly collect personal information from children under 13.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">9. Changes to This Policy</h2>
            <p className="text-xs text-gray-700 leading-relaxed">We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">10. Contact Us</h2>
            <p className="text-xs text-gray-700 leading-relaxed">If you have any questions about this Privacy Policy, please contact us at <a href="/contact" className="text-blue-600 hover:underline">contact@myresult.in</a></p>
          </div>

        </div>

      </div>

      <Footer />
    </main>
  )
}