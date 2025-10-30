import { useState } from "react";
import Reveal from "./Reveal";
import { Code2, Database, BarChart3, Cpu, Wrench } from "lucide-react";

const skills = [
  { name: "Python", level: 90, category: "data", icon: <Cpu size={18} /> },
  { name: "Excel / Google Sheets", level: 95, category: "data", icon: <BarChart3 size={18} /> },
  { name: "SQL / MySQL", level: 95, category: "data", icon: <Database size={18} /> },
  { name: "PL/SQL", level: 88, category: "data", icon: <Database size={18} /> },
  { name: "Tableau", level: 85, category: "data", icon: <BarChart3 size={18} /> },
  { name: "Spring Boot", level: 80, category: "web", icon: <Code2 size={18} /> },
  { name: "HTML/CSS", level: 80, category: "web", icon: <Code2 size={18} /> },
  { name: "JavaScript", level: 80, category: "web", icon: <Code2 size={18} /> },
  { name: "React", level: 80, category: "web", icon: <Code2 size={18} /> },
  { name: "Tailwind CSS", level: 77, category: "web", icon: <Code2 size={18} /> },
  { name: "C++", level: 80, category: "tools", icon: <Wrench size={18} /> },
  { name: "Java", level: 80, category: "tools", icon: <Wrench size={18} /> },
  { name: "Git / GitHub", level: 75, category: "tools", icon: <Wrench size={18} /> },
  { name: "VS Code", level: 95, category: "tools", icon: <Wrench size={18} /> },
];

const categories = ["all", "data", "web", "tools"];

export const SkillsSection = () => {
  const [tab, setTab] = useState("all");
  const filtered = skills.filter(s => tab === "all" || s.category === tab);

  return (
    <section id="skills" className="scroll-mt-28 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-center mb-12">
            Skills & Tools
          </h2>
        </Reveal>

        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setTab(c)}
              className={`px-4 py-2 rounded-full text-sm border transition-all duration-300
                ${tab === c 
                  ? "bg-neutral-900 text-white border-neutral-900" 
                  : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
            >
              {c}
            </button>
          ))}
        </div>

      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.04}>
              <div className="group relative border border-neutral-200 rounded-2xl p-6 bg-white 
                hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition-all duration-300">

                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-neutral-900 text-white group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-900">{s.name}</h3>
                </div>

                
                <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className="h-2 bg-neutral-900 rounded-full origin-left"
                    style={{ width: `${s.level}%` }}
                  />
                </div>

                <p className="text-sm text-neutral-500 mt-2 opacity-70 group-hover:opacity-100 transition-opacity">
                  Proficiency: {s.level}%
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
