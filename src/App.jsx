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

export default function App() {
  return (
    <div className="relative min-h-screen bg-black text-ink">
      <div className="noise" />
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
