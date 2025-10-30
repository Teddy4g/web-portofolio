import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { SkillsSection } from "../components/SkillsSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { CertificateSection } from "../components/CertificateSection";
import { Footer } from "../components/FooterSection";

export const Home = () => {
  return (
   <div className="bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <div className="section-wrapper pt-32">
        <HeroSection />
      </div>

      {/* About */}
      <div className="section-wrapper">
        <AboutSection />
      </div>

      {/* Skills */}
      <div className="section-wrapper bg-muted/10">
        <SkillsSection />
      </div>

      {/* Projects */}
      <div className="section-wrapper">
        <ProjectsSection />
      </div>

      {/* Certificates */}
      <div className="section-wrapper bg-muted/10">
        <CertificateSection />
      </div>

      <Footer />
    </div>
  );
};