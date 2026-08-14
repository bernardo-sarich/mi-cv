import { useEffect, useState } from 'react'
import { AppProvider, useCVData } from './context/AppContext.jsx'
import Nav from './components/layout/Nav.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/sections/Hero.jsx'
import Experience from './components/sections/Experience.jsx'
import Skills from './components/sections/Skills.jsx'
import Projects from './components/sections/Projects.jsx'
import Contact from './components/sections/Contact.jsx'
import MatrixRain from './components/ui/MatrixRain.jsx'
import LoadingScreen from './components/ui/LoadingScreen.jsx'

const LOADING_SCREEN_DELAY_MS = 250

// Delays the loading placeholder instead of showing it the instant `loading`
// flips true: if the CV request already resolves within the delay (DB/Function
// already warm), the placeholder never mounts at all, avoiding a needless flash.
function useDelayedLoading(loading, delayMs) {
  const [delayElapsed, setDelayElapsed] = useState(false)

  useEffect(() => {
    if (!loading) {
      setDelayElapsed(false)
      return
    }

    const timer = setTimeout(() => setDelayElapsed(true), delayMs)
    return () => clearTimeout(timer)
  }, [loading, delayMs])

  return loading && delayElapsed
}

function AppContent() {
  const { loading } = useCVData()
  const showLoading = useDelayedLoading(loading, LOADING_SCREEN_DELAY_MS)

  return (
    // The flex classes restore the layout role this element had as a direct
    // flex child of #root; `relative z-10` lifts it above the rain, which
    // cannot sit at a negative z-index because body is opaque.
    <div className="relative z-10 flex flex-1 flex-col">
      <Nav />
      {showLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Hero />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </>
      )}
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <MatrixRain side="left" />
      <MatrixRain side="right" />
      <AppContent />
    </AppProvider>
  )
}

export default App
