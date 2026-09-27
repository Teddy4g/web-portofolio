import os
import time
from openai import OpenAI
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

OPENAI_MODEL = "text-embedding-3-small"
EMBEDDING_DIM = 1536

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

openai_client = OpenAI(api_key=OPENAI_API_KEY)

# ─────────────────────────────────────────────────────────────
# 1. MICROSOFT GRAPHRAG COMMUNITIES (C0, C1, C2, C3)
# ─────────────────────────────────────────────────────────────
COMMUNITIES = [
    {
        "id": "C0_ROOT",
        "level": 0,
        "name": "C0_ROOT",
        "title": "Root Overview — Ted's Background, Work, Projects, and Data Engineering Expertise",
        "summary": "EXECUTIVE SUMMARY: Teddy Agustinus (Ted) is an Informatics Engineering student at Universitas Tarumanagara (UNTAR) in Jakarta, Indonesia (graduating December 2026), currently working as a Master Data Management (MDM) Data Analyst Intern at Kawan Lama Group (Feb 2026 – Feb 2027) under Corporate Strategic Development. His long-term goal is to become an AI Engineer through Data Engineering.\n\nWORK EXPERIENCE & EDUCATION:\n- Current Role: MDM Data Analyst Intern at Kawan Lama Group, focusing on data governance for SAP ECC to S/4HANA migration.\n- Education: Informatics Engineering student at UNTAR, Jakarta. Fluent in English and Bahasa Indonesia, HSK 3 Mandarin Chinese.\n- Academic & Prior Roles: CS Lab Instructor at UNTAR (2023–2025) teaching Database Design (PL/SQL), Applied Statistics, and Algorithms (C++) to 74 students/class; Math Teacher and Data Analyst at a Study Center (2023–2025) processing student and institutional data in Google Sheets for decision-making reports.\n\nALL PROJECTS BUILT BY TED:\n1. RAG KBLI Industry Classifier: AI classification pipeline mapping companies to KBLI 2025 codes using MongoDB Atlas, OpenAI embeddings, BM25 hybrid search, and Claude Haiku (evolved from n8n + GPT-4o-mini).\n2. Article Master Data Cleansing: Large-scale governance cleansing over 1M+ articles across 40M+ rows and 3,000+ sites for SAP S/4HANA migration using Python and Apps Script.\n3. Catalyst MDM Platform: Debugged and maintained Google Apps Script platform for KLG MDM team (fixed duplicate request numbers, row drift, error handling) + n8n vendor classification.\n4. Operational Reporting & ETL: Monthly SAP master data reports (matplotlib, seaborn, Leaflet) powered by Airflow and dbt pipelines feeding BigQuery star schemas.\n5. Employee Workload Dashboard: Analyzed team productivity, SLA compliance, and overtime directly from internal PIR (Price/Item Request) tracking data at KLG.\n6. BOM Cross-Reference & Enrichment: Google Colab BOM tool for Semi Finish Goods + Tavily LLM company-description enrichment pipeline.\n7. Rental Tablet (Kiosk System): Paid freelance tablet-rental kiosk (Android, MQTT/EMQX, Node.js Fastify, PostgreSQL, Next.js dashboard).\n8. Telegram Cashflow Bot: Personal finance tracking bot (PythonAnywhere migrated to VPS).\n9. Daily Macro Email Alert System: Python system tracking IDR/USD, BI rate, DXY index.\n\nDATA ENGINEERING EXPERTISE:\nTed has strong, proven expertise in Data Engineering. He has led 40M+ row ETL data cleansing pipelines, orchestrated workflows using Apache Airflow and dbt into Google BigQuery star schemas, managed vector DBs (MongoDB Atlas) and relational DBs (PostgreSQL, PL/SQL), and taught Database Design and Applied Statistics at UNTAR."
    },
    {
        "id": "C1_INTERNSHIP",
        "level": 1,
        "name": "C1_INTERNSHIP",
        "title": "Community C1 — Kawan Lama Group Internship & Master Data Management",
        "summary": "COMMUNITY SUMMARY: KAWAN LAMA GROUP INTERNSHIP\nTed works at Kawan Lama Group (KLG), a major retail/industrial conglomerate in Indonesia, as an MDM (Master Data Management) Data Analyst Intern under the Corporate Strategic Development division (Feb 2026 – Feb 2027).\n\nKEY INITIATIVES & TOOLS AT INTERNSHIP:\n- Enterprise Migration: Supports SAP ECC to S/4HANA migration.\n- Master Data Cleansing: Cleansed 1M+ articles across 40M+ rows spanning 3,000+ sites using Python and Google Apps Script automation.\n- Catalyst Platform vs KBLI Classifier: Catalyst is an internal Google Apps Script platform for MDM operational workflows (fixed request number duplicates, row-index drift, silent errors, n8n vendor classification). In contrast, the KBLI Classifier is a standalone AI/RAG pipeline using MongoDB Atlas and Claude Haiku that automatically maps company profiles to official KBLI 2025 industry codes.\n- Employee Workload Dashboard: Analyzes productivity, SLA compliance, and overtime connected directly to internal PIR (Price/Item Request) tracking data.\n- Operational Reporting: Monthly reporting using Airflow, dbt, BigQuery, matplotlib, seaborn, and Leaflet maps.\n- Internship Tools Used: SAP (ECC & S/4HANA), Python, Google Apps Script, MongoDB Atlas, OpenAI Embeddings, Claude Haiku, Airflow, dbt, BigQuery, Looker Studio, matplotlib, seaborn, Leaflet, n8n, Google Colab."
    },
    {
        "id": "C2_PROJECTS",
        "level": 1,
        "name": "C2_PROJECTS",
        "title": "Community C2 — AI, Full-Stack & Independent Engineering Projects",
        "summary": "COMMUNITY SUMMARY: PROJECTS & TECHNOLOGIES\nTed has built numerous AI, Data, and Full-Stack projects:\n\n1. KBLI Industry Classifier (AI/RAG): Built with MongoDB Atlas (vector DB), OpenAI embeddings, hybrid dense/BM25 search, and Claude Haiku LLM. Evolved from an n8n + GPT-4o-mini prototype for cost efficiency.\n2. Rental Tablet System (Freelance Kiosk): Built with Android frontend, MQTT protocol with EMQX broker for real-time communication, Node.js Fastify backend, PostgreSQL database, and Next.js admin dashboard.\n3. Catalyst MDM Platform: Google Apps Script + n8n workflow automation.\n4. Telegram Cashflow Bot: Hosted on PythonAnywhere, later migrated to VPS.\n5. Macro Alert System: Python automated email digest tracking IDR/USD, BI rate, and DXY dollar index."
    },
    {
        "id": "C3_EDUCATION",
        "level": 1,
        "name": "C3_EDUCATION",
        "title": "Community C3 — Education, Prior Roles & Technical Competencies",
        "summary": "COMMUNITY SUMMARY: EDUCATION, TEACHING & SKILLS\n- University: Informatics Engineering student at Universitas Tarumanagara (UNTAR), Jakarta (graduating Dec 2026).\n- Study Center Role: Math teacher and Data Analyst (2023–2025) processing student and performance data in Google Sheets to generate decision-making reports.\n- Academic Teaching: CS Lab Instructor at UNTAR (2023–2025) teaching Database Design (SQL, PL/SQL stored procedures), Applied Statistics (hypothesis testing, regression), and C++ Algorithms to up to 74 students per class.\n- Data Engineering Competency: Ted is highly proficient in Data Engineering. He builds Airflow/dbt/BigQuery ETL pipelines, manages 40M+ row data governance workflows, works with vector & relational databases, writes PL/SQL, and designs cloud schemas."
    }
]

# ─────────────────────────────────────────────────────────────
# 2. PASSAGES
# ─────────────────────────────────────────────────────────────
PASSAGES = [
    {
        "id": "identity_background",
        "category": "About",
        "text": "Teddy Agustinus, known as Ted, is an Informatics Engineering student at Universitas Tarumanagara in Jakarta, Indonesia, where he is based. Ted expects to graduate in December 2026. He communicates fluently in both Bahasa Indonesia and English, and has studied Mandarin Chinese to HSK 3 level. Ted's long-term career goal is to become an AI Engineer, using Data Engineering as his entry path."
    },
    {
        "id": "current_role",
        "category": "Work Experience",
        "text": "Ted is currently in a year-long MBKM industry internship (February 2026 to February 2027) at Kawan Lama Group, working as a Master Data Management (MDM) Data Analyst under the Corporate Strategic Development division. His work focuses on data governance and data quality initiatives supporting a large-scale enterprise system migration from SAP ECC to S/4HANA."
    },
    {
        "id": "project_data_cleansing",
        "category": "Projects",
        "text": "At Kawan Lama Group, Ted led a large-scale article master data cleansing initiative as part of the SAP ECC-to-S/4HANA migration. The project involved cleansing more than a million articles across roughly 40 million rows spanning 3,000+ sites. He used Python and Google Apps Script automation to generate per-brand review spreadsheets for stakeholders."
    },
    {
        "id": "project_catalyst",
        "category": "Projects",
        "text": "Ted debugged and maintained Catalyst, a Google Apps Script platform used by the MDM team at Kawan Lama Group. His work included fixing duplicate request numbers, resolving row-index drift issues, and improving silent error handling. He also built n8n workflow automation for vendor classification."
    },
    {
        "id": "project_rag_pipeline",
        "category": "Projects",
        "text": "At Kawan Lama Group, Ted built an AI RAG-based classification pipeline that assigns Indonesian companies to KBLI 2025 industry codes. The system uses MongoDB Atlas as the vector database, OpenAI embeddings for semantic search, a hybrid dense/BM25 retrieval approach, and Claude Haiku as the language model. The pipeline went through multiple iterated versions. This approach evolved from an earlier n8n + GPT-4o-mini agent, which was later migrated to the RAG-based vector search approach for cost efficiency."
    },
    {
        "id": "project_reporting_etl",
        "category": "Projects",
        "text": "Ted produces monthly operational reports over SAP Master Data at Kawan Lama Group using matplotlib, seaborn for visualization, and Leaflet maps for geographic data. He built ETL pipelines using Apache Airflow for orchestration and dbt for data transformation, moving data from Google Sheets into BigQuery for analysis."
    },
    {
        "id": "project_workload_dashboard",
        "category": "Projects",
        "text": "Ted built an employee workload dashboard at Kawan Lama Group that analyzes productivity, SLA compliance, and overtime from internal PIR (Price/Item Request) tracking data. The dashboard provides visibility into team performance metrics and helps management monitor workload distribution."
    },
    {
        "id": "project_bom_enrichment",
        "category": "Projects",
        "text": "Ted built a BOM (Bill of Materials) cross-reference tool for Semi Finish Good articles in Google Colab at Kawan Lama Group. He also developed a company-description enrichment pipeline using Tavily for web search and an LLM to automatically populate company descriptions in Google Sheets."
    },
    {
        "id": "project_rental_tablet",
        "category": "Projects",
        "text": "Outside his internship, Ted built Rental Tablet, a paid freelance tablet-rental kiosk system. The system was built on Android for the tablet frontend with real-time communication via MQTT using the EMQX broker, a Node.js backend using the Fastify framework, a PostgreSQL database for transaction storage, and a Next.js frontend for the management dashboard."
    },
    {
        "id": "project_cashflow_bot",
        "category": "Projects",
        "text": "Ted built a Telegram cashflow bot for personal finance tracking. The bot was originally hosted on PythonAnywhere and later migrated to a VPS for more control and reliability. This is one of Ted's independent side projects."
    },
    {
        "id": "prior_experience",
        "category": "Work Experience",
        "text": "Before his internship at Kawan Lama Group, Ted worked as a lab instructor at Universitas Tarumanagara from 2023 to 2025, teaching three courses: Database Design and Management (SQL, PL/SQL, stored procedures), Applied Statistics (probability distributions, hypothesis testing, linear regression), and Algorithms and Programming (data structures, memory management, algorithm optimization using C++). He taught up to 74 students per class. Separately, Ted worked as a math teacher and data analyst at a Study Center during the same period."
    },
    {
        "id": "personal_interests",
        "category": "Personal",
        "text": "Ted has a strong personal interest in macroeconomics, investing, and geopolitical analysis. He tracks indicators like IDR/USD exchange rates, the BI (Bank Indonesia) rate, and the DXY dollar index. He built a Python-based daily macroeconomic email alert system that sends automated digests with market and economic data."
    },
    {
        "id": "skills_tools",
        "category": "Skills",
        "text": "Ted's technical skills and tools include: Python, SQL, PL/SQL, C++, JavaScript, Node.js (Fastify), Next.js, Google Apps Script, SAP (ECC and S/4HANA), Google BigQuery, MongoDB Atlas, PostgreSQL, Apache Airflow, dbt, Vector Databases, RAG, LLMs (Claude Haiku, GPT-4o-mini), OpenAI Embeddings, n8n workflow automation, Looker Studio, matplotlib, seaborn, Leaflet maps, MQTT/EMQX, Android development, and Google Colab."
    },
    {
        "id": "contact",
        "category": "Contact",
        "text": "You can reach Ted via LinkedIn at linkedin.com/in/teddyagustinus or his portfolio website at web-portofolio-teddy.vercel.app. Ted is open to discussions about Data Engineering, AI Engineering opportunities, research collaborations, and graduate school connections."
    }
]

# ─────────────────────────────────────────────────────────────
# 3. ENTITIES
# ─────────────────────────────────────────────────────────────
ENTITIES = [
    {"id": "ted", "label": "Person", "name": "Teddy Agustinus", "description": "Teddy Agustinus (Ted), Informatics Engineering student at UNTAR and Data Analyst Intern at Kawan Lama Group."},
    {"id": "klg", "label": "Organization", "name": "Kawan Lama Group", "description": "Kawan Lama Group (KLG), major retail/industrial conglomerate in Indonesia."},
    {"id": "untar", "label": "Organization", "name": "Universitas Tarumanagara", "description": "Universitas Tarumanagara (UNTAR), private university in Jakarta, Indonesia."},
    {"id": "study_center", "label": "Organization", "name": "Study Center", "description": "Tutoring center where Ted worked as Math Teacher & Data Analyst."},
    {"id": "proj_data_cleansing", "label": "Project", "name": "Article Data Cleansing", "description": "40M+ rows, 1M+ articles cleansing across 3000+ sites for SAP S/4HANA migration."},
    {"id": "proj_catalyst", "label": "Project", "name": "Catalyst Platform", "description": "Google Apps Script platform for KLG MDM operations."},
    {"id": "proj_rag_pipeline", "label": "Project", "name": "RAG KBLI Classifier", "description": "AI pipeline mapping company profiles to KBLI 2025 industry codes."},
    {"id": "proj_reporting", "label": "Project", "name": "Operational Reporting & ETL", "description": "Airflow & dbt ETL pipelines into BigQuery for SAP Master Data."},
    {"id": "proj_workload", "label": "Project", "name": "Employee Workload Dashboard", "description": "Productivity & SLA dashboard connected to internal PIR data."},
    {"id": "proj_rental_tablet", "label": "Project", "name": "Rental Tablet System", "description": "Freelance tablet rental kiosk (Android, Fastify, MQTT, PostgreSQL, Next.js)."},
    {"id": "proj_cashflow_bot", "label": "Project", "name": "Telegram Cashflow Bot", "description": "Personal finance tracking bot on VPS."},
    {"id": "role_mdm_analyst", "label": "Role", "name": "MDM Data Analyst Intern", "description": "Internship role at Kawan Lama Group Corporate Strategic Development."},
    {"id": "role_lab_instructor", "label": "Role", "name": "CS Lab Instructor", "description": "Lab Instructor at UNTAR teaching PL/SQL, Statistics, and C++."},
    {"id": "skill_python", "label": "Skill", "name": "Python", "description": "Python programming language."},
    {"id": "skill_mongodb", "label": "Skill", "name": "MongoDB Atlas", "description": "MongoDB Atlas vector database for RAG search."},
    {"id": "skill_sql", "label": "Skill", "name": "SQL / PL/SQL", "description": "Relational database querying and stored procedures."}
]

# ─────────────────────────────────────────────────────────────
# 4. RELATIONSHIPS & COMMUNITY ASSIGNMENTS
# ─────────────────────────────────────────────────────────────
RELATIONSHIPS = [
    ("ted", "WORKS_AT", "klg"),
    ("ted", "STUDIES_AT", "untar"),
    ("ted", "WORKED_AT", "study_center"),
    ("ted", "BUILT", "proj_data_cleansing"),
    ("ted", "BUILT", "proj_catalyst"),
    ("ted", "BUILT", "proj_rag_pipeline"),
    ("ted", "BUILT", "proj_reporting"),
    ("ted", "BUILT", "proj_workload"),
    ("ted", "BUILT", "proj_rental_tablet"),
    ("ted", "BUILT", "proj_cashflow_bot"),
    ("proj_data_cleansing", "PART_OF", "klg"),
    ("proj_catalyst", "PART_OF", "klg"),
    ("proj_rag_pipeline", "PART_OF", "klg"),
    ("proj_reporting", "PART_OF", "klg"),
    ("proj_workload", "PART_OF", "klg"),
    ("role_mdm_analyst", "AT", "klg"),
    ("role_lab_instructor", "AT", "untar"),
]

# Map entities to explicit C0, C1, C2, C3 Community nodes
ENTITY_COMMUNITY_MAP = {
    "klg": "C1_INTERNSHIP",
    "role_mdm_analyst": "C1_INTERNSHIP",
    "proj_data_cleansing": "C1_INTERNSHIP",
    "proj_catalyst": "C1_INTERNSHIP",
    "proj_workload": "C1_INTERNSHIP",
    "proj_reporting": "C1_INTERNSHIP",
    
    "proj_rag_pipeline": "C2_PROJECTS",
    "proj_rental_tablet": "C2_PROJECTS",
    "proj_cashflow_bot": "C2_PROJECTS",
    "skill_mongodb": "C2_PROJECTS",
    
    "untar": "C3_EDUCATION",
    "study_center": "C3_EDUCATION",
    "role_lab_instructor": "C3_EDUCATION",
    "skill_python": "C3_EDUCATION",
    "skill_sql": "C3_EDUCATION",

    "ted": "C0_ROOT"
}

def embed_texts(texts):
    res = openai_client.embeddings.create(model=OPENAI_MODEL, input=texts)
    return [item.embedding for item in res.data]

def upload_all(session):
    print("  🗑️  Clearing old graph data...")
    session.run("MATCH (n) DETACH DELETE n")

    # Create Indexes
    session.run("""
        CREATE VECTOR INDEX passage_embeddings IF NOT EXISTS FOR (p:Passage) ON p.embedding
        OPTIONS { indexConfig: { `vector.dimensions`: $dim, `vector.similarity_function`: 'cosine' } }
    """, dim=EMBEDDING_DIM)

    session.run("CREATE FULLTEXT INDEX passage_fulltext IF NOT EXISTS FOR (p:Passage) ON EACH [p.text, p.category]")

    # 1. Upload Communities (C0, C1, C2, C3)
    print("  🏛️  Uploading Community Nodes (C0, C1, C2, C3)...")
    for comm in COMMUNITIES:
        session.run("""
            CREATE (c:Community {
                id: $id,
                level: $level,
                name: $name,
                title: $title,
                summary: $summary
            })
        """, id=comm["id"], level=comm["level"], name=comm["name"], title=comm["title"], summary=comm["summary"])

    # 2. Upload Passages with embeddings
    print("  📝 Uploading Passages with Embeddings...")
    passage_texts = [p["text"] for p in PASSAGES]
    p_embs = embed_texts(passage_texts)
    for passage, emb in zip(PASSAGES, p_embs):
        session.run("""
            CREATE (p:Passage {id: $id, category: $category, text: $text, embedding: $emb})
        """, id=passage["id"], category=passage["category"], text=passage["text"], emb=emb)

    # 3. Upload Entities with embeddings
    print("  🏷️  Uploading Entities with Embeddings...")
    entity_texts = [e["description"] for e in ENTITIES]
    e_embs = embed_texts(entity_texts)
    for entity, emb in zip(ENTITIES, e_embs):
        session.run(f"""
            CREATE (e:Entity:{entity['label']} {{id: $id, name: $name, description: $desc, embedding: $emb}})
        """, id=entity["id"], name=entity["name"], desc=entity["description"], emb=emb)

    # 4. Upload Relationships
    print("  🔗 Uploading Entity Relationships...")
    for src, rel, tgt in RELATIONSHIPS:
        session.run(f"""
            MATCH (a:Entity {{id: $src}})
            MATCH (b:Entity {{id: $tgt}})
            CREATE (a)-[:{rel}]->(b)
        """, src=src, tgt=tgt)

    # 5. Link Entities & Passages to Communities (:IN_COMMUNITY)
    print("  🌐 Drawing :IN_COMMUNITY edges to C0_ROOT, C1_INTERNSHIP, C2_PROJECTS, C3_EDUCATION...")
    for entity_id, comm_id in ENTITY_COMMUNITY_MAP.items():
        session.run("""
            MATCH (e:Entity {id: $eid})
            MATCH (c:Community {id: $cid})
            CREATE (e)-[:IN_COMMUNITY]->(c)
        """, eid=entity_id, cid=comm_id)

    # Link C1, C2, C3 to C0_ROOT hierarchy
    session.run("""
        MATCH (c:Community) WHERE c.id <> 'C0_ROOT'
        MATCH (c0:Community {id: 'C0_ROOT'})
        CREATE (c)-[:SUB_COMMUNITY_OF]->(c0)
    """)

    print("  ✅ Complete Graph Uploaded to Neo4j AuraDB with C0, C1, C2, C3!")

def main():
    print("=" * 60)
    print("  Uploading Microsoft GraphRAG Index to Neo4j AuraDB")
    print("=" * 60)

    uri_to_use = NEO4J_URI.replace("neo4j+s://", "neo4j+ssc://")
    driver = GraphDatabase.driver(uri_to_use, auth=(NEO4J_USERNAME, NEO4J_PASSWORD))

    with driver.session() as session:
        upload_all(session)

    driver.close()
    print("=" * 60)

if __name__ == "__main__":
    main()
