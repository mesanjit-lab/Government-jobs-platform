import Header from './components/Header'
import Hero from './components/Hero'
import Tools from './components/Tools'
import LatestJobs from './components/LatestJobs'
import LatestResults from './components/LatestResults'
import LatestAdmitCards from './components/LatestAdmitCards'
import BottomSections from './components/BottomSections'
import Footer from './components/Footer'
import MobileHome from './components/MobileHome'

export default function Home() {
  return (
    <>
      {/* Mobile — below lg */}
      <div className="lg:hidden">
        <MobileHome />
      </div>

      {/* Desktop — lg and above */}
      <main className="hidden lg:block min-h-screen bg-gray-50">
        <Header />
        <Hero />
        <Tools />

        <section className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <LatestResults />
          <LatestAdmitCards />
          <LatestJobs />
        </section>
        <BottomSections />
        <Footer />
      </main>
    </>
  )
}
