import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, activeSection, scrollToSection }) {
  return (
    <>
      <div className="top-accent-line"></div>
      <header className="navbar">
        <div className="nav-container">
          <a href="#" className="brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className="brand-name">Teddy!</span>
          </a>

          <nav className="nav-links">
            {['about', 'experience', 'education', 'social'].map((sec) => (
              <button
                key={sec}
                className={`nav-item ${activeSection === sec ? 'active' : ''}`}
                onClick={() => scrollToSection(sec)}
              >
                {sec.charAt(0).toUpperCase() + sec.slice(1)}
              </button>
            ))}

            <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}
