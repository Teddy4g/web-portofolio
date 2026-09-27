import React from 'react';

export default function About() {
  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">01. Overview</span>
          <h2 className="section-title">About Me</h2>
        </div>

        <div className="about-grid">
          <div className="about-card bio-card">
            <h3>Bridging Data & AI Solutions</h3>
            <p>
              I am <strong>Teddy Agustinus ("Ted")</strong>, an Information System student at <strong>Universitas Tarumanagara (UNTAR)</strong>, Jakarta (expected graduation Dec 2026). Currently working as an <strong>MDM Data Analyst Intern at Kawan Lama Group</strong>
            </p>
            <p>
              My work spans master data governance for <strong>SAP ECC-to-S/4HANA migration</strong>, building cost-effective <strong>RAG-based industry classification pipelines</strong> (Vector DB, LLMs), cleaning 40M+ rows of data with Python & BigQuery, and automating enterprise workflows.
            </p>

            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-number">40M+</span>
                <span className="stat-label">Rows Cleansed (BigQuery/SAP)</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">3</span>
                <span className="stat-label">Lab Courses Taught (UNTAR)</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Dec '26</span>
                <span className="stat-label">Expected Graduation</span>
              </div>
            </div>
          </div>

          <div className="about-card skills-card">
            <h3>Skills & Technologies</h3>
            
            <div className="skills-group">
              <h4>Languages & Foundations</h4>
              <div className="tags">
                <span className="tag">Python</span>
                <span className="tag">SQL (PL/SQL)</span>
                <span className="tag">C++</span>
                <span className="tag">JavaScript</span>
                <span className="tag">Node.js</span>
              </div>
            </div>

            <div className="skills-group">
              <h4>Data & Cloud Systems</h4>
              <div className="tags">
                <span className="tag">BigQuery</span>
                <span className="tag">SAP ECC / S/4HANA</span>
                <span className="tag">PostgreSQL</span>
                <span className="tag">Vector DBs (Cosine Similarity)</span>
                <span className="tag">Automation using Apps Script</span>
              </div>
            </div>

            <div className="skills-group">
              <h4>AI, ML & Analytics</h4>
              <div className="tags">
                <span className="tag">RAG Pipelines</span>
                <span className="tag">Looker Studio</span>
                <span className="tag">Dimension Modeling</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
