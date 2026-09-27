import React from 'react';

export default function Experience() {
  return (
    <section className="section experience-section" id="experience">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">02. Career</span>
          <h2 className="section-title">Work Experience</h2>
        </div>

        <div className="timeline">
          {/* Role 1 */}
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-header">
                <h3>MDM Data Analyst Intern</h3>
                <span className="timeline-date">Feb 2026 – Feb 2027</span>
              </div>
              <span className="timeline-company">Kawan Lama Group • Corporate Strategic Development</span>
              <p>
                Leading master data governance & optimization for the enterprise-wide <strong>SAP ECC to S/4HANA migration</strong>:
              </p>
              <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <li>Built a <strong>RAG-based industry classification pipeline</strong> (Vector DB, Cosine Similarity, LLM) mapping companies to KBLI codes, rebuilt for high cost-efficiency from an earlier n8n workflow.</li>
                <li>Led large-scale <strong> Data cleansing (40M+ rows)</strong> executing Python ETL pipelines against Google BigQuery and SAP.</li>
                <li>Automated monthly daily reporting dashboards in Looker Studio via git actions and MDM workflows via Google Apps Script.</li>
                <li>Designed & implemented an internal employee workload tracking dashboard.</li>
              </ul>
              <div className="tags">
                <span className="tag-sm">Python</span>
                <span className="tag-sm">BigQuery</span>
                <span className="tag-sm">SAP S/4HANA</span>
                <span className="tag-sm">Vector DB / RAG</span>
                <span className="tag-sm">Looker Studio</span>
                <span className="tag-sm">Apps Script</span>
                <span className="tag-sm">Automation</span>
              </div>
            </div>
          </div>

          {/* Role 2 */}
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-header">
                <h3>Computer Science Lab Instructor</h3>
                <span className="timeline-date">2023 – 2025</span>
              </div>
              <span className="timeline-company">Universitas Tarumanagara (UNTAR)</span>
              <p>
                Instructed up to 74 undergraduate students per class across three core computing courses:
              </p>
              <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <li><strong>Database Design & Management:</strong> Relational database design, SQL querying, and PL/SQL procedures.</li>
                <li><strong>Applied Statistics:</strong> Statistical modeling, probability distributions, and linear regression.</li>
                <li><strong>Algorithms & Programming:</strong> Data structures, memory management, and algorithm optimization in C++.</li>
              </ul>
              <div className="tags">
                <span className="tag-sm">PL/SQL</span>
                <span className="tag-sm">Relational DB</span>
                <span className="tag-sm">C++</span>
                <span className="tag-sm">Linear Regression</span>
                <span className="tag-sm">Teaching</span>
              </div>
            </div>
          </div>

          {/* Role 3 */}
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-header">
                <h3>Data Analyst & Mathematics Teacher</h3>
                <span className="timeline-date">2023 – 2025</span>
              </div>
              <span className="timeline-company">Study Center</span>
              <p>
                Processed and visualized institutional performance datasets in Google Sheets to guide executive decision-making. Taught mathematics across all academic education levels.
              </p>
              <div className="tags">
                <span className="tag-sm">Data Viz</span>
                <span className="tag-sm">Google Sheets</span>
                <span className="tag-sm">Mathematics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
