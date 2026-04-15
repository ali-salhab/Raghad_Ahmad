import { usePortfolio } from '../hooks/usePortfolio'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import ExperienceSection from '../components/Experience'
import EducationSection from '../components/Education'
import Projects from '../components/Projects'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Portfolio() {
  const { data, loading, error } = usePortfolio()

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-dark gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 animate-spin" />
        </div>
        <p className="text-white/40 text-sm animate-pulse">Loading portfolio...</p>
      </div>
    )
  }

  if (error || !data || !data.personal) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-dark gap-4">
        <div className="text-5xl">⚠️</div>
        <p className="text-white/60">{error || 'Something went wrong'}</p>
        <button onClick={() => window.location.reload()} className="btn-outline text-sm">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="bg-dark min-h-screen">
      <Navbar name={data.personal.name} />
      <Hero data={data} />
      <About personal={data.personal} />
      <Skills skills={data.skills} />
      <ExperienceSection experience={data.experience} />
      <EducationSection education={data.education} />
      <Projects projects={data.projects} />
      <Contact personal={data.personal} />
      <Footer personal={data.personal} />
    </div>
  )
}
