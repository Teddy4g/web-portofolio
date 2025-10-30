import Reveal from "./Reveal";
import { BarChart2, Bot, LineChart } from "lucide-react";

export const AboutSection = () => {
  const skills = [
    {
      icon: <BarChart2 size={22} />,
      title: "Data Analysis",
      desc: "Transforming complex datasets into actionable insights through exploration, visualization, and performance metrics.",
      delay: 0.12,
    },
    {
      icon: <Bot size={22} />,
      title: "Machine Learning",
      desc: "Building predictive models and experimentation pipelines to solve real-world problems using statistical and ML techniques.",
      delay: 0.18,
    },
    {
      icon: <LineChart size={22} />,
      title: "Strategy & Business Insight",
      desc: "Translating business objectives into scalable digital solutions with structured thinking and measurable impact.",
      delay: 0.24,
    },
  ];

  return (
    <section id="about" className="scroll-mt-28 py-20">
      <div className="max-w-6xl mx-auto px-6">

        <Reveal>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
            About Me
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">

          {/* LEFT — Description */}
          <Reveal delay={0.05} className="space-y-6">
            <p className="text-neutral-700 text-lg leading-relaxed">
              I'm an Information Systems student passionate about connecting{" "}
              <span className="font-semibold text-neutral-900">design, data, and technology</span>{" "}
              to build thoughtful, user-centered solutions.
            </p>

            <p className="text-neutral-600 text-base leading-relaxed">
              My experience spans data analytics, ML modeling, product thinking,
              and hands-on development across academic and real-world projects.
              I enjoy solving complex problems with both{" "}
              <span className="font-medium text-neutral-900">analytical precision</span> 
              and <span className="font-medium text-neutral-900">creative execution</span>.
            </p>

            <a
              href="https://www.linkedin.com/in/teddyagustinus/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-neutral-900 font-medium underline underline-offset-[6px] decoration-neutral-300 hover:decoration-neutral-800 transition-all"
            >
              LinkedIn →
            </a>
          </Reveal>

          {/* RIGHT — Skill Blocks */}
          <div className="space-y-6 md:space-y-7">
            {skills.map((s, i) => (
              <Reveal delay={s.delay} key={i}>
                <div className="group relative border border-neutral-200 rounded-xl px-6 py-6 transition-all duration-300 hover:bg-white hover:shadow-lg hover:border-neutral-300">


                  <div className="absolute left-0 top-0 h-full w-[3px] bg-neutral-900/70 rounded-r-full origin-left scale-y-0 group-hover:scale-y-100 transition-all duration-500"></div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-neutral-900 text-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {s.icon}
                    </div>

                    <div>
                      <h3 className="font-semibold text-[18px] mb-1 text-neutral-900">
                        {s.title}
                      </h3>
                      <p className="text-neutral-600 text-sm leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
