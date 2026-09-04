import Header from './components/Header'
import Hero from './components/Hero'
import Stats from './components/Stats'
import LatestJobs from './components/LatestJobs'
import LatestResults from './components/LatestResults'
import LatestAdmitCards from './components/LatestAdmitCards'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <Stats />
      <LatestJobs />
      <LatestResults />
      <LatestAdmitCards />
      <Footer />
    </main>
  )
}