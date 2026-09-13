import Header from '../components/Header'
import Footer from '../components/Footer'
import { ChevronRight } from 'lucide-react'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-1 text-xs text-blue-200 mb-2">
            <a href="/" className="hover:text-white">Home</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Terms of Use</span>
          </div>
          <h1 className="text-xl font-bold">Terms of Use</h1>
          <p className="text-blue-200 text-sm mt-1">Last updated: September 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">1. Acceptance of Terms</h2>
            <p className="text-xs text-gray-700 leading-relaxed">By accessing and using MyResult, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our website.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">2. About MyResult</h2>
            <p className="text-xs text-gray-700 leading-relaxed">MyResult is an informational platform that provides government job notifications, exam results, admit cards, answer keys, syllabus and related tools. MyResult is NOT affiliated with any government organization, examination board or recruitment authority.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">3. Information Accuracy</h2>
            <p className="text-xs text-gray-700 leading-relaxed">We make reasonable efforts to provide accurate and up-to-date information. However, we do not guarantee the completeness, accuracy or timeliness of any information on this website. Candidates must always verify details from the official recruitment notification and official website of the concerned authority before applying.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">4. Use of Tools</h2>
            <p className="text-xs text-gray-700 leading-relaxed">Our tools including Age Calculator, Eligibility Checker, Photo Resize and PDF Tools are provided for general assistance only. Results from these tools are not guaranteed to be accurate for official purposes. Always verify requirements from the official notification.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">5. Prohibited Activities</h2>
            <p className="text-xs text-gray-700 leading-relaxed mb-2">You agree not to:</p>
            <ul className="space-y-1 text-xs text-gray-700">
              <li className="flex items-start gap-2"><span className="text-red-500 flex-shrink-0">•</span>Use this website for any unlawful purpose</li>
              <li className="flex items-start gap-2"><span className="text-red-500 flex-shrink-0">•</span>Attempt to gain unauthorized access to our systems</li>
              <li className="flex items-start gap-2"><span className="text-red-500 flex-shrink-0">•</span>Copy, reproduce or redistribute our content without permission</li>
              <li className="flex items-start gap-2"><span className="text-red-500 flex-shrink-0">•</span>Use automated tools to scrape or collect data from our website</li>
              <li className="flex items-start gap-2"><span className="text-red-500 flex-shrink-0">•</span>Impersonate any government organization or official</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">6. Intellectual Property</h2>
            <p className="text-xs text-gray-700 leading-relaxed">All content on MyResult including text, graphics, logos and tools is the property of MyResult unless otherwise stated. Government job notifications and official documents remain the property of the respective government organizations.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">7. Disclaimer of Liability</h2>
            <p className="text-xs text-gray-700 leading-relaxed">MyResult shall not be liable for any loss, damage or inconvenience arising from the use of information provided on this website. We are not responsible for any errors, omissions or changes in government job notifications.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">8. External Links</h2>
            <p className="text-xs text-gray-700 leading-relaxed">Our website contains links to official government websites and other external websites. We are not responsible for the content, accuracy or availability of these external websites.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">9. Changes to Terms</h2>
            <p className="text-xs text-gray-700 leading-relaxed">We reserve the right to modify these Terms of Use at any time. Continued use of MyResult after any changes constitutes your acceptance of the new terms.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">10. Governing Law</h2>
            <p className="text-xs text-gray-700 leading-relaxed">These terms shall be governed by the laws of India. Any disputes arising from the use of MyResult shall be subject to the jurisdiction of courts in India.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-blue-900 mb-2">11. Contact Us</h2>
            <p className="text-xs text-gray-700 leading-relaxed">If you have any questions about these Terms of Use, please contact us at <a href="/contact" className="text-blue-600 hover:underline">contact@myresult.in</a></p>
          </div>

        </div>

      </div>

      <Footer />
    </main>
  )
}