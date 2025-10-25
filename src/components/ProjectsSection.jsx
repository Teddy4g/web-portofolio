import { useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Tableau Project 1",
    description:
      "Cleaned and transformed 6M+ London bike ride records in Python, then built an interactive Tableau dashboard to explore how weather and seasonal trends affect cycling behavior.",
    image: "/projects/DATA2.jpeg",
    tags: ["Excel", "Python", "Tableau"],
    demoUrl:
      "https://public.tableau.com/app/profile/teddy.agustinus/viz/LondonBikeRidesNumberofCyclingTripsinLondon/Dashboard1",
  },
  {
    id: 2,
    title: "Tableau Project 2",
    description:
      "Cleaned and transformed 36K+ loan records in MySQL, then built an interactive Tableau dashboard to monitor loan performance and borrower trends.",
    image: "/projects/DATA1.jpeg",
    tags: ["Excel", "SQL", "Tableau"],
    demoUrl:
      "https://public.tableau.com/app/profile/teddy.agustinus/viz/BankLoan_17592366179120/OVERVIEW",
  },
  {
    id: 3,
    title: "Data Science Project 1",
    description:
      "Machine learning model predicting loan default risk using demographic and financial data.",
    image: "/projects/DATA4.jpeg",
    tags: ["Python", "Machine Learning", "PowerPoint"],
    demoUrl: "https://www.canva.com/design/DAG2KGf6DiU/r6tl3ozRn0haJilR6of_6w/edit?utm_content=DAG2KGf6DiU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    id: 4,
    title: "Data Science Project 2",
    description:
      "Clustered U.S. lake ecosystem data using HDBSCAN to identify high-risk regions from agricultural and urban pressures in a sustainability competition project.",
    image: "/projects/DATA3.jpeg",
    tags: ["Python", "HDBSCAN", "PowerPoint"],
    demoUrl:
      "https://www.canva.com/design/DAG0dfPwPKM/oFl7kTJ29IwGSMeEMukEOQ/edit",
  },
  {
    id: 5,
    title: "Academic Big Data Project",
    description:
      "Developed an LSTM-based stock prediction model with SHAP explainability to interpret key drivers in time-series forecasts for U.S. tech stocks.",
    image: "/projects/Big Data.jpeg",
    tags: ["Python", "LSTM", "Deep Learning"],
    demoUrl: "https://github.com/Teddy4g/BIGDATA",
  },
  {
    id: 6,
    title: "Machine learning Project",
    description:
      "Built a Streamlit app to predict fraudulent transactions using logistic regression and EDA on simulated real-world banking data.",
    image: "/projects/ML1.jpeg",
    tags: ["Python", "Streamlit", "Logistic Regression"],
    demoUrl: "https://github.com/Teddy4g/ML-Fraud-Detection",
  },
  {
    id: 7,
    title: "Portofolio Website",
    description:
      "A modern portfolio website designed to share my journey in data, design, and problem-solving, blending technical precision with personal creativity.",
    image: "/projects/webporto.jpeg",
    tags: ["React", "TailwindCSS", "Vercel"],
    demoUrl: "https://web-portofolio-teddy.vercel.app/",
  },
  
];

export const ProjectsSection = () => {
  const [visibleCount, setVisibleCount] = useState(3);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 3);

  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Featured <span className="text-primary">Projects</span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          A collection of projects that demonstrate my experience in analytics, visualization, and structured problem-solving. Each project reflects my ability to translate data into actionable insights, design analytical workflows, and present findings that support better decision-making.
        </p>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, visibleCount).map((project) => (
            <div
              key={project.id}
              className="group bg-card rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-1">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 hover:text-primary transition-colors duration-300"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < projects.length && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="cosmic-button w-fit flex items-center mx-auto gap-2"
            >
              Load More
            </button>
          </div>
        )}

        {/* GitHub Button */}
        <div className="text-center mt-12">
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            href="https://github.com/Teddy4g"
            rel="noopener noreferrer"
          >
            Check My GitHub <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};
