import Header from './components/Header'
import Hero from './components/Hero'
import Tools from './components/Tools'
import LatestJobs from './components/LatestJobs'
import LatestResults from './components/LatestResults'
import LatestAdmitCards from './components/LatestAdmitCards'
import BottomSections from './components/BottomSections'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <Tools />

      {/* 3 Column Section */}
      <section className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <LatestJobs />
        <LatestAdmitCards />
        <LatestResults />
      </section>

      <BottomSections />
      <Footer />
    </main>
  )
}