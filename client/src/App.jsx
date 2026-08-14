import { AppProvider } from './context/AppContext.jsx'
import Nav from './components/layout/Nav.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/sections/Hero.jsx'
import Experience from './components/sections/Experience.jsx'
import Skills from './components/sections/Skills.jsx'
import Projects from './components/sections/Projects.jsx'
import Contact from './components/sections/Contact.jsx'
import MatrixRain from './components/ui/MatrixRain.jsx'

function App() {
  return (
    <AppProvider>
      <MatrixRain side="left" />
      <MatrixRain side="right" />
      {/* The flex classes restore the layout role these elements had as direct
          flex children of #root; `relative z-10` lifts them above the rain,
          which cannot sit at a negative z-index because body is opaque. */}
      <div className="relative z-10 flex flex-1 flex-col">
        <Nav />
        <Hero />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </AppProvider>
  )
}

export default App
