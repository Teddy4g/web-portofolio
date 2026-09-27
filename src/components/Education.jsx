import React from 'react';

export default function Education() {
  return (
    <section className="section education-section" id="education">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">03. Background</span>
          <h2 className="section-title">Education, Research & Projects</h2>
        </div>

        <div className="grid-2">
          {/* Education & Thesis Card */}
          <div className="edu-card">
            <div className="edu-icon">🎓</div>
            <h3>B.S. in Information System</h3>
            <p className="edu-institution">Universitas Tarumanagara (UNTAR), Jakarta</p>
            <span className="edu-date">Expected Graduation: December 2026</span>
          </div>

          {/* Projects & Aspirations Card */}
          <div className="edu-card">
            <div className="edu-icon">⚡</div>
            <h3>Projects & Languages </h3>
            <ul className="cert-list">
              <li>
                <strong>Tablet Rental Kiosk System (Freelance):</strong> Built a complete IoT-enabled kiosk platform with Android, MQTT (EMQX), Node.js (Fastify), PostgreSQL & Next.js.
              </li>
              <li>
                <strong>Language Proficiency:</strong> Mandarin, English, Indonesia.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
