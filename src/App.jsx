import Nav from "./components/Nav";
import PrismaHero from "./components/ui/PrismaHero";
import About from "./components/About";
import Capabilities from "./components/Capabilities";
import Experience from "./components/Experience";
import Certifications from "./components/Certifications";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CursorGlow from "./components/ui/CursorGlow";
import KineticGrid from "./components/ui/KineticGrid";

export default function App() {
  return (
    <div className="relative min-h-screen bg-ground text-ink">
      <div className="noise" />
      <KineticGrid />
      <CursorGlow />
      <div className="relative z-10">
        <Nav />
        <main>
          <PrismaHero />
          <About />
          <Capabilities />
          <Experience />
          <Certifications />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
