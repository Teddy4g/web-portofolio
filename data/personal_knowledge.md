# Teddy Agustinus — Canonical Personal Knowledge Base

## Identity and Education

Teddy Agustinus, commonly known as Ted, is an Information Systems student at Universitas Tarumanagara in Jakarta, Indonesia. He is based in Jakarta and expects to graduate in December 2026. Ted communicates fluently in Bahasa Indonesia and English and has studied Mandarin Chinese to approximately HSK 3 level. His academic and professional interests are concentrated around data, software engineering, artificial intelligence, automation, and enterprise information systems.

## Current Role at Kawan Lama Group

Ted is completing a year-long MBKM industry internship at Kawan Lama Group from February 2026 to February 2027. He works as a Master Data Management Data Analyst. His work focuses on master data management, data governance, data quality, analytics, automation, and initiatives that support the company's migration from SAP ECC to SAP S/4HANA.

## Master Data Cleansing

At Kawan Lama Group, Ted worked on a large-scale Article Master Data cleansing initiative that supports the migration from SAP ECC to SAP S/4HANA. The project involved more than one million articles and roughly 40 million rows of data.

Ted applied an ETL, or Extract-Transform-Load, approach during the project. Using Google Colab, he extracted the required datasets from Google BigQuery and then used Python to perform data transformation, cleansing, and normalization. The objective was to improve the consistency, quality, and usability of the master data before migration into SAP S/4HANA.

Ted also used Google Apps Script to automate the generation of review spreadsheets for data owners, allowing relevant business users to review the cleansed master data.

## Catalyst Automation Platform Maintenance

Ted worked on Catalyst, an internal Google Apps Script automation platform used by the Master Data Management team at Kawan Lama Group. His responsibilities included debugging and maintaining the platform, fixing duplicate request numbers, resolving row-index drift issues, and improving silent error handling.

This work exposed Ted to operational problems associated with spreadsheet-based workflows, Google Workspace automation, and internal master-data processes.

## KBLI 2025 RAG Classification Pipeline

Ted developed a Retrieval-Augmented Generation, or RAG, classification pipeline for assigning Indonesian companies to KBLI 2025 industry codes.

The system converts company information and KBLI knowledge into numerical vector representations using OpenAI embeddings. The generated vectors are stored in a vector database using MongoDB Atlas Vector Search.

When a company needs to be classified, the system generates an embedding for the query and searches the vector database for semantically relevant KBLI information.

The retrieval architecture uses a hybrid strategy combining dense-vector semantic search with BM25 keyword retrieval. The retrieved context is then supplied to Claude Haiku, which acts as the language model responsible for analyzing the evidence and determining an appropriate KBLI classification.

The pipeline evolved through multiple iterations. An earlier implementation used an n8n workflow with GPT-4o-mini. It was later redesigned around RAG and vector-based retrieval to improve retrieval efficiency and reduce the cost of repeatedly sending large amounts of contextual information directly to a language model.

## Operational Reporting and Visualization

Ted produces monthly operational reports based on SAP Master Data at Kawan Lama Group. He uses Python-based visualization tools such as matplotlib and seaborn and has also used Leaflet maps for geographic visualization.

The reporting work is intended to make operational master-data information easier to interpret and communicate to stakeholders.

## Employee Workload Dashboard

Ted built an employee workload dashboard at Kawan Lama Group using internal PIR, or Price/Item Request, tracking data.

The dashboard analyzes employee productivity, SLA compliance, overtime, workload distribution, and related team-performance metrics. Its purpose is to give management better visibility into operational workload and team performance.

## Bill of Materials Cross-Reference Tool

Ted built a Bill of Materials, or BOM, cross-reference tool for Semi Finish Good articles using Google Colab.

The tool was created to support master-data work by helping users cross-reference BOM information for relevant articles.

## Previous Experience at Universitas Tarumanagara

Before his internship at Kawan Lama Group, Ted worked as a laboratory instructor at Universitas Tarumanagara from 2023 to 2025.

He taught Database Design and Management, including SQL, PL/SQL, and stored procedures.

He also taught Applied Statistics, including probability distributions, hypothesis testing, and linear regression.

In addition, he taught Algorithms and Programming, including data structures, memory management, and algorithm optimization using C++.

Ted taught classes with as many as 74 students. The experience strengthened both his technical foundation and his ability to explain technical and quantitative concepts to other people.

## Study Center Experience

During approximately the same 2023-to-2025 period, Ted worked at a Study Center as a mathematics teacher and data analyst.

His responsibilities included teaching mathematics and processing data in Google Sheets to support institutional analysis and decision-making.

## Rental Tablet Freelance Project

Outside his internship, Ted built Rental Tablet, a paid freelance tablet-rental kiosk system.

The system uses an Android application as the tablet-facing frontend, MQTT for real-time communication through an EMQX broker, a Node.js backend built with the Fastify framework, PostgreSQL for transaction storage, and a Next.js frontend for the management dashboard.

The project gave Ted experience integrating mobile software, real-time communication, backend services, relational databases, and a management interface.

## Telegram Cashflow Bot

Ted built a Telegram cashflow bot for personal finance tracking as an independent side project.

The bot was originally hosted on PythonAnywhere and was later migrated to a VPS to provide greater control and reliability.

## Technical Skills

Ted's technical experience includes Python, SQL, PL/SQL, C++, JavaScript, Node.js, Fastify, Next.js, Google Apps Script, PostgreSQL, Google BigQuery, MongoDB Atlas, SAP ECC, SAP S/4HANA, ETL processes, data transformation, data normalization, vector databases, Retrieval-Augmented Generation, large language models, OpenAI embeddings, hybrid dense-and-keyword retrieval, n8n workflow automation, matplotlib, seaborn, Leaflet, Looker Studio, MQTT, EMQX, Android development, and Google Colab.

His experience spans data analysis, master data management, data cleansing, data quality, data engineering, database work, automation, RAG systems, software development, visualization, and enterprise systems.

## Personal Interests

Ted has a strong personal interest in macroeconomics, investing, and geopolitical analysis.

He follows economic and market indicators including the Indonesian rupiah against the US dollar, Bank Indonesia's policy rate, the DXY US Dollar Index, and broader financial-market developments.

He is also interested in continuing to improve his Mandarin Chinese.

## Professional Direction and Contact

Ted is open to discussions and opportunities related to Data Engineering, AI Engineering, research collaboration, and graduate-school connections.

His public contact point is LinkedIn:

linkedin.com/in/teddyagustinus
