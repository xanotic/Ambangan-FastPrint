import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServicesShowcase from "./components/ServicesShowcase";
import ShowcaseGrid from "./components/ShowcaseGrid";
import AboutUs from "./components/AboutUs";
import ContactEstimate from "./components/ContactEstimate";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="relative min-h-screen bg-[#07090e] font-sans antialiased text-white selection:bg-white/10 selection:text-white">
      {/* Glow backgrounds */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#29b6d8]/5 via-transparent to-transparent pointer-events-none -z-10" />

      {/* Navigation bar */}
      <Navbar />

      {/* Main Sections */}
      <main>
        {/* Cinematic landing hero */}
        <Hero />

        {/* Interactive service selectors */}
        <ServicesShowcase />

        {/* Curation showcase gallery */}
        <ShowcaseGrid />

        {/* Immersive About Us studio section */}
        <AboutUs />

        {/* Project intake and consultation form */}
        <ContactEstimate />
      </main>

      {/* Contact and address footer */}
      <Footer />
    </div>
  );
}

export default App;
