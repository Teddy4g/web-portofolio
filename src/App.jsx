import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Social from './components/Social';
import QAModal from './components/QAModal';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('');
  const [qaQuery, setQaQuery] = useState('');
  const [qaTemplate, setQaTemplate] = useState(null);
  const [isQaOpen, setIsQaOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'experience', 'education', 'social'];
      
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
      if (isAtBottom) {
        setActiveSection('social');
        return;
      }

      const scrollPosition = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = document.getElementById(sections[i]);
        if (sec && sec.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          return;
        }
      }
      setActiveSection('');
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAsk = (query, template = null) => {
    setQaQuery(query);
    setQaTemplate(template);
    setIsQaOpen(true);
  };

  return (
    <div className="app-wrapper">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

      <main>
        <Hero onAsk={handleAsk} />
        <About />
        <Experience />
        <Education />
        <Social />
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <p>© 2026 Teddy Agustinus.</p>
          <button
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top ↑
          </button>
        </div>
      </footer>

      <QAModal
        isOpen={isQaOpen}
        onClose={() => setIsQaOpen(false)}
        query={qaQuery}
        templateAnswer={qaTemplate}
      />
    </div>
  );
}
