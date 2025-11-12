import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";

const projects = [
  {
    id: 1,
    title: "RFM Analysis & CLV Dashboard",
    role: "Data Analyst",
    year: "2025",
    desc: "Strategic dashboard for customer segmentation and sales analysis.",
    image: "/projects/DATA5.jpeg",
    link: "https://public.tableau.com/app/profile/teddy.agustinus/viz/RetailAnalyst_17624110113550/DetailProducts?publish=yes",
  },
  {
    id: 2,
    title: "Loan risk Dashboard",
    role: "Data Analyst",
    year: "2025",
    desc: "Loan risk dashboard from SQL pipeline; monitor borrower KPIs.",
    image: "/projects/DATA1.jpeg",
    link: "https://public.tableau.com/app/profile/teddy.agustinus/viz/BankLoan_17592366179120/OVERVIEW",
  },
  {
    id: 3,
    title: "London Bikes Analysis",
    role: "Data Analyst",
    year: "2025",
    desc: "Analyzed 6M+ bike trips; seasonal demand & weather patterns.",
    image: "/projects/DATA2.jpeg",
    link: "https://public.tableau.com/app/profile/teddy.agustinus/viz/LondonBikeRidesNumberofCyclingTripsinLondon/Dashboard1",
  },
  {
    id: 4,
    title: "Loan Default ML Model",
    role: "ML Engineer",
    year: "2025",
    desc: "Predict default probabilities using logistic regression",
    image: "/projects/DATA4.jpeg",
    link: "https://www.canva.com/design/DAG2KGf6DiU/r6tl3ozRn0haJilR6of_6w/edit?utm_content=DAG2KGf6DiU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    id: 5,
    title: "Sustainability Clustering",
    role: "Machine Learning",
    year: "2025",
    desc: "HDBSCAN to detect ecosystem risk zones across U.S. lakes.",
    image: "/projects/DATA3.jpeg",
    link: "https://www.canva.com/design/DAG0dfPwPKM/oFl7kTJ29IwGSMeEMukEOQ/edit",
  },
  {
    id: 6,
    title: "Tech Stock LSTM Forecasting",
    role: "Data Scientist",
    year: "2025",
    desc: "LSTM forecasting with SHAP drivers for tech stocks.",
    image: "/projects/Big Data.jpeg",
    link: "https://github.com/Teddy4g/BIGDATA",
  },
  {
    id: 7,
    title: "Personal Portfolio Website",
    role: "Frontend",
    year: "2025",
    desc: "Modern animated portfolio with React, Tailwind, Motion.",
    image: "/projects/webporto.jpeg",
    link: "https://web-portofolio-teddy.vercel.app/",
  },
  {
    id: 8,
    title: "Hotel Booking Management System",
    role: "Fullstack",
    year: "2025",
    desc: "Backend service for hotel management built with Spring Boot and MySQL",
    image: "/projects/springboot.jpeg",
    link: "https://github.com/Teddy4g/hotelbooking-springboot",
  },
];

export const ProjectsSection = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="projects" className="scroll-mt-28 py-24 relative">
      <div className="max-w-6xl mx-auto px-6">

        <Reveal>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">
            Projects
          </h2>
        </Reveal>

       <Reveal>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 md:mb-12 gap-3">

        <p className="italic text-neutral-600 text-base md:text-lg">
          my <span className="font-semibold">professional</span> projects
        </p>

        <a
          href="https://github.com/Teddy4g"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-neutral-900 font-medium underline underline-offset-[6px] decoration-neutral-300 hover:decoration-neutral-800 transition-all group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
            width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
            className="group-hover:scale-110 transition-transform">
            <path d="M12 .297a12 12 0 00-3.797 23.393c.6.113.82-.258.82-.577 
            0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61 
            -.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 
            1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.997 
            .108-.776.418-1.305.762-1.604-2.665-.304-5.466-1.332-5.466-5.93 
            0-1.31.47-2.38 1.236-3.22-.124-.303-.535-1.524.117-3.176 
            0 0 1.008-.322 3.3 1.23a11.52 11.52 0 016.003 0c2.29-1.552 
            3.297-1.23 3.297-1.23 .653 1.653.242 2.874.118 3.176 
            .768.84 1.235 1.91 1.235 3.22 0 4.61-2.804 5.624-5.475 
            5.92 .43.37.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 
            0 .322.218.694.825.576A12 12 0 0012 .297" />
          </svg>
          GitHub →
        </a>
      </div>
</Reveal>

      
        <AnimatePresence>
          {hovered && (
            <motion.img
              src={hovered.image}
              alt=""
              initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
              className="hidden md:block fixed top-1/2 left-1/2 w-[320px] lg:w-[360px] h-[220px] lg:h-[240px] object-cover rounded-xl shadow-2xl pointer-events-none z-50"
            />
          )}
        </AnimatePresence>

      
        <div className="hidden sm:grid grid-cols-4 text-[11px] md:text-xs uppercase tracking-widest text-neutral-500 mb-3">
          <span>Name</span>
          <span className="text-center">Role</span>
          <span className="text-center">Description</span>
          <span className="text-right">Year</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-neutral-300/50">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => window.open(p.link, "_blank")}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22,1,0.36,1] }}
              className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-0 py-5 cursor-pointer group"
            >
              <span className="font-medium text-lg group-hover:opacity-60">{p.title}</span>
              <span className="text-neutral-600 group-hover:opacity-60 sm:text-center">{p.role}</span>
              <span className="text-neutral-500 text-sm group-hover:opacity-60 sm:text-center">{p.desc}</span>
              <span className="text-neutral-600 group-hover:opacity-60 sm:text-right">{p.year}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
