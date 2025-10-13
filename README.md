# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# 🌐 Teddy Portfolio

A personal portfolio website built with **Vite + React + Tailwind CSS**, designed to showcase my projects, skills, and professional journey as an **Information Systems student** passionate about connecting strategy, data, and technology.  
Deployed on [Vercel](https://vercel.com) for fast performance and seamless CI/CD.

---

## 🚀 Live Demo
👉 [Visit Portfolio]([https://your-vercel-link.vercel.app](https://web-portofolio-teddy.vercel.app/))

---

## ✨ Features

### 🏠 Home
- Animated hero section with a dynamic star background.
- Introductory text highlighting professional focus: strategy, data, and technology.
- Smooth scrolling and interactive “View My Work” button.

### 👨‍💻 About Me
- A concise introduction describing background, mindset, and interests.
- Feature cards for three core domains:
  - **Data Analysis** – turning raw data into insights.
  - **Machine Learning** – exploring predictive models and data-driven decisions.
  - **Strategy & Business Insight** – connecting structured thinking with real business challenges.
- LinkedIn integration button for direct networking.

### ⚙️ Skills
- Categorized technical stack: **Data**, **Frontend**, and **Tools**.
- Animated progress bars showing proficiency levels in:
  - Python, SQL/MySQL, PL/SQL
  - Excel/Google Sheets, Tableau
  - HTML/CSS, JavaScript, React, Tailwind CSS
  - C++, Java, Git/GitHub

### 📊 Projects
- Grid-based layout showcasing featured analytics & ML projects:
  1. **London Bike Ride Analysis** – Python + Tableau visualization of weather & seasonal impact.
  2. **Bank Loan Dashboard** – MySQL + Tableau interactive performance report.
  3. **Big Data Project – SHAP & LSTM Stock Prediction** – deep learning with explainability (SHAP) for stock forecasting.
- Each card includes tags, short description, and external project link.

### 🏅 Certifications
- Dynamic card carousel displaying professional certificates:
  - SQL (Basic, Intermediate, Advanced) – HackerRank 2025.
- Each certificate opens in a new tab via secure external link.

### 🌙 Theme
- Elegant **dark theme** with glowing stars background.
- Smooth animations and responsive layout across devices.

---

## 🧱 Tech Stack

| Category | Tools |
|-----------|-------|
| **Frontend** | React, Vite, Tailwind CSS |
| **UI Components** | Lucide Icons, Framer Motion |
| **Linting** | ESLint |
| **Deployment** | Vercel |
| **Version Control** | Git + GitHub |

## ⚙️ Installation & Setup

Clone this repository and install dependencies.

```bash
# Clone repository
git clone https://github.com/TeddyAg/web-portofolio.git
cd web-portofolio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
