/**
 * Ted's Portfolio Knowledge Base — English Only
 *
 * With the English-only guardrail, we no longer need bilingual chunks.
 * Each chunk has a single `text` field used for both embedding and display.
 *
 * Chunk design:
 * - 1 focused topic per chunk
 * - Granular enough for precise retrieval (don't bundle unrelated projects)
 * - FAQ chunks mirror likely user questions for high cosine matches
 */

export const knowledgeChunks = [
  // ─────────────────────────────────────────────────────────────
  // PASSAGE CHUNKS
  // ─────────────────────────────────────────────────────────────
  {
    id: "identity_background",
    category: "About",
    text: `Teddy Agustinus, known as Ted, is an Informatics Engineering student at Universitas Tarumanagara in Jakarta, Indonesia, where he is based. Ted expects to graduate in December 2026. He communicates fluently in both Bahasa Indonesia and English, and has studied Mandarin Chinese to HSK 3 level. Ted's long-term career goal is to become an AI Engineer, using Data Engineering as his entry path.`,
    embedding: null,
  },
  {
    id: "current_role",
    category: "Work Experience",
    text: `Ted is currently in a year-long MBKM industry internship (February 2026 to February 2027) at Kawan Lama Group, working as a Master Data Management (MDM) Data Analyst under the Corporate Strategic Development division. His work focuses on data governance and data quality initiatives supporting a large-scale enterprise system migration from SAP ECC to S/4HANA. Ted's internship spans several distinct projects including data cleansing, platform maintenance, RAG-based classification, operational reporting, and dashboard development.`,
    embedding: null,
  },
  {
    id: "project_data_cleansing",
    category: "Projects",
    text: `At Kawan Lama Group, Ted led a large-scale article master data cleansing initiative as part of the SAP ECC-to-S/4HANA migration. The project involved cleansing more than a million articles across roughly 40 million rows spanning 3,000+ sites. He used Python and Google Apps Script automation to generate per-brand review spreadsheets for stakeholders. This was one of the core data governance efforts supporting the enterprise system migration.`,
    embedding: null,
  },
  {
    id: "project_catalyst",
    category: "Projects",
    text: `Ted debugged and maintained Catalyst, a Google Apps Script platform used by the MDM team at Kawan Lama Group. His work included fixing duplicate request numbers, resolving row-index drift issues, and improving silent error handling. He also built n8n workflow automation for vendor classification as part of the platform's operational tooling.`,
    embedding: null,
  },
  {
    id: "project_rag_pipeline",
    category: "Projects",
    text: `At Kawan Lama Group, Ted built an AI RAG-based classification pipeline that assigns Indonesian companies to KBLI 2025 industry codes. The system uses MongoDB Atlas as the vector database, OpenAI embeddings for semantic search, a hybrid dense/BM25 retrieval approach, and Claude Haiku as the language model. The pipeline went through multiple iterated versions. This approach evolved from an earlier n8n + GPT-4o-mini agent, which was later migrated to the RAG-based vector search approach for cost efficiency. The system supports data standardization and governance at Kawan Lama Group.`,
    embedding: null,
  },
  {
    id: "project_reporting_etl",
    category: "Projects",
    text: `Ted produces monthly operational reports over SAP Master Data at Kawan Lama Group using matplotlib, seaborn for visualization, and Leaflet maps for geographic data. He built ETL pipelines using Apache Airflow for orchestration and dbt for data transformation, moving data from Google Sheets into BigQuery for analysis. This reporting infrastructure supports the Corporate Strategic Development division's data-driven decision making.`,
    embedding: null,
  },
  {
    id: "project_workload_dashboard",
    category: "Projects",
    text: `Ted built an employee workload dashboard at Kawan Lama Group that analyzes productivity, SLA compliance, and overtime from internal PIR (Price/Item Request) tracking data. The dashboard provides visibility into team performance metrics and helps management monitor workload distribution across the MDM team.`,
    embedding: null,
  },
  {
    id: "project_bom_enrichment",
    category: "Projects",
    text: `Ted built a BOM (Bill of Materials) cross-reference tool for Semi Finish Good articles in Google Colab at Kawan Lama Group. He also developed a company-description enrichment pipeline using Tavily for web search and an LLM to automatically populate company descriptions in Google Sheets, supporting the master data governance process.`,
    embedding: null,
  },
  {
    id: "project_rental_tablet",
    category: "Projects",
    text: `Outside his internship, Ted built Rental Tablet, a paid freelance tablet-rental kiosk system. The system was built on Android for the tablet frontend with real-time communication via MQTT using the EMQX broker, a Node.js backend using the Fastify framework, a PostgreSQL database for transaction storage, and a Next.js frontend for the management dashboard. The project is a complete full-stack system.`,
    embedding: null,
  },
  {
    id: "project_cashflow_bot",
    category: "Projects",
    text: `Ted built a Telegram cashflow bot for personal finance tracking. The bot was originally hosted on PythonAnywhere and later migrated to a VPS for more control and reliability. This is one of Ted's independent side projects built outside of his internship work.`,
    embedding: null,
  },
  {
    id: "prior_experience",
    category: "Work Experience",
    text: `Before his internship at Kawan Lama Group, Ted worked as a lab instructor at Universitas Tarumanagara from 2023 to 2025, teaching three courses: Database Design and Management (SQL, PL/SQL, stored procedures), Applied Statistics (probability distributions, hypothesis testing, linear regression), and Algorithms and Programming (data structures, memory management, algorithm optimization using C++). He taught up to 74 students per class. Separately, Ted worked as a math teacher and data analyst at a Study Center during the same period, where he processed data in Google Sheets and built reports supporting institutional decision-making.`,
    embedding: null,
  },
  {
    id: "personal_interests",
    category: "Personal",
    text: `Ted has a strong personal interest in macroeconomics, investing, and geopolitical analysis. He tracks indicators like IDR/USD exchange rates, the BI (Bank Indonesia) rate, and the DXY dollar index. He built a Python-based daily macroeconomic email alert system that sends automated digests with market and economic data. These interests complement his technical work in data engineering and analytics.`,
    embedding: null,
  },
  {
    id: "skills_tools",
    category: "Skills",
    text: `Ted's technical skills and tools include: Python, SQL, PL/SQL, C++, JavaScript, Node.js (Fastify), Next.js, Google Apps Script, SAP (ECC and S/4HANA), Google BigQuery, MongoDB Atlas, PostgreSQL, Apache Airflow, dbt, Vector Databases, RAG (Retrieval-Augmented Generation), LLMs (Claude Haiku, GPT-4o-mini), OpenAI Embeddings, n8n workflow automation, Looker Studio, matplotlib, seaborn, Leaflet maps, MQTT/EMQX, Android development, and Google Colab. He has expertise in Data Engineering, AI Engineering, ETL pipelines, data governance, machine learning, and data visualization.`,
    embedding: null,
  },
  {
    id: "contact",
    category: "Contact",
    text: `You can reach Ted via LinkedIn at linkedin.com/in/teddyagustinus or his portfolio website at web-portofolio-teddy.vercel.app. Ted is open to discussions about Data Engineering, AI Engineering opportunities, research collaborations, and graduate school connections.`,
    embedding: null,
  },

  // ─────────────────────────────────────────────────────────────
  // FAQ CHUNKS — Written as Q&A pairs to directly match
  // common user query patterns for high cosine similarity.
  // ─────────────────────────────────────────────────────────────
  {
    id: "faq_who_is_ted",
    category: "FAQ",
    text: `Q: Who is Ted? A: Ted (Teddy Agustinus) is an Informatics Engineering student at Universitas Tarumanagara in Jakarta, Indonesia, expected to graduate in December 2026. He speaks Bahasa Indonesia, English, and Mandarin Chinese (HSK 3). His career goal is to become an AI Engineer.`,
    embedding: null,
  },
  {
    id: "faq_current_work",
    category: "FAQ",
    text: `Q: Where does Ted work? What is Ted's current job? A: Ted is doing a year-long MBKM internship at Kawan Lama Group as a Master Data Management Data Analyst, from February 2026 to February 2027. He works under the Corporate Strategic Development division on data governance, data cleansing, RAG pipelines, reporting, and dashboard projects supporting an SAP ECC-to-S/4HANA migration.`,
    embedding: null,
  },
  {
    id: "faq_projects",
    category: "FAQ",
    text: `Q: What projects has Ted worked on? A: At Kawan Lama Group: a 40M+ row data cleansing initiative, a RAG-based KBLI industry classification pipeline using MongoDB Atlas and Claude Haiku, the Catalyst Apps Script platform, monthly operational reports with Airflow/dbt/BigQuery, an employee workload dashboard, a BOM cross-reference tool, and a company-description enrichment pipeline. Outside work: a freelance tablet rental kiosk system (Rental Tablet) and a Telegram cashflow bot.`,
    embedding: null,
  },
  {
    id: "faq_ai_experience",
    category: "FAQ",
    text: `Q: Does Ted have AI or machine learning experience? A: Yes. Ted built a RAG-based classification pipeline using MongoDB Atlas, OpenAI embeddings, hybrid dense/BM25 search, and Claude Haiku for KBLI industry code assignment. This evolved from an earlier n8n + GPT-4o-mini agent that he migrated to a vector search approach for cost efficiency. He also built a company-description enrichment pipeline using Tavily and an LLM.`,
    embedding: null,
  },
  {
    id: "faq_skills",
    category: "FAQ",
    text: `Q: What technical skills does Ted have? A: Python, SQL, PL/SQL, C++, JavaScript, Node.js, Next.js, Google Apps Script, SAP (ECC/S4HANA), BigQuery, MongoDB Atlas, PostgreSQL, Airflow, dbt, Vector Databases, RAG, LLMs (Claude Haiku, GPT-4o-mini), OpenAI Embeddings, n8n, Looker Studio, matplotlib, seaborn, Leaflet, MQTT/EMQX, Android, and Google Colab.`,
    embedding: null,
  },
  {
    id: "faq_thesis_teaching",
    category: "FAQ",
    text: `Q: Has Ted taught before? A: Yes, Ted was a lab instructor at Universitas Tarumanagara from 2023 to 2025, teaching Database Design (PL/SQL), Applied Statistics (linear regression, hypothesis testing), and Algorithms and Programming (C++) to up to 74 students per class. He also worked as a math teacher at a Study Center.`,
    embedding: null,
  },
  {
    id: "faq_contact_goals",
    category: "FAQ",
    text: `Q: How can I contact Ted? What are Ted's career goals? A: Reach Ted via LinkedIn at linkedin.com/in/teddyagustinus or his portfolio at web-portofolio-teddy.vercel.app. Ted's long-term goal is to become an AI Engineer, using Data Engineering as his entry path. He is open to AI Engineering, Data Engineering, research, and graduate school discussions.`,
    embedding: null,
  },
];
