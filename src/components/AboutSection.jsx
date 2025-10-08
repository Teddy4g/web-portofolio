import { BarChart2 } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { Bot } from "lucide-react";
import { BarChart } from "lucide-react";
import { Briefcase, Code, User } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4 relative">
      {" "}
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          About <span className="text-primary"> Me</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">
              Curious Problem Solver & Tech-Minded Creator
            </h3>

            <p className="text-muted-foreground">
              As an Information Systems student, I enjoy connecting ideas, people, and technology to create structured yet meaningful solutions. 
              Through academic projects and organizational experiences, I’ve learned to approach challenges with both analytical precision and creative adaptability. 
              I’m passionate about continuous learning — exploring how data, systems, and design thinking can work together to make an impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <a href="#contact" className="cosmic-button">
                {" "}
                Get In Touch
              </a>

              <a
                href="https://www.linkedin.com/in/teddyagustinus/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg"> Data Anlysis</h4>
                  <p className="text-muted-foreground">
                    Turning raw data into actionable insights through structured exploration, visualization, and analytical thinking.
                    I enjoy uncovering patterns that help inform smarter decisions.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">Machine Learning</h4>
                  <p className="text-muted-foreground">
                   Exploring predictive models and algorithms to understand complex systems and forecast meaningful trends.
                   Focused on making data work smarter, not just bigger.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>

                <div className="text-left">
                  <h4 className="font-semibold text-lg">UI/UX Design</h4>
                  <p className="text-muted-foreground">
                    Designing intuitive interfaces that translate data and insights into accessible, user-friendly experiences.
                    Bridging logic and creativity to help ideas connect with people.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};