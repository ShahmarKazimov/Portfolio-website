import Nav from "./components/Nav";
import PrismaHero from "./components/ui/PrismaHero";
import About from "./components/About";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Certifications from "./components/Certifications";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CursorGlow from "./components/ui/CursorGlow";
import Preloader from "./components/ui/Preloader";

export default function App() {
  return (
    <div className="relative min-h-screen bg-black text-ink">
      <Preloader />
      <div className="noise" />
      <CursorGlow />
      <div className="relative z-10">
        <Nav />
        <main>
          <PrismaHero />
          <About />
          <Experience />
          <Education />
          <Certifications />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
