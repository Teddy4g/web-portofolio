import { useState } from "react";
import { ExternalLink } from "lucide-react";

export const CertificateSection = () => {
  const certificates = [
    {
      id: 1,
      title: "SQL (Basic) – HackerRank",
      issuer: "HackerRank",
      year: "2025",
      image: "/certificates/1SERTI.png",
      link: "https://www.hackerrank.com/certificates/76355e386f51",
    },
    {
      id: 2,
      title: "SQL (Intermediate) – HackerRank",
      issuer: "HackerRank",
      year: "2025",
      image: "/certificates/2SERTI.png",
      link: "https://www.hackerrank.com/certificates/c6741f8d7164",
    },
    {
      id: 3,
      title: "SQL (Advanced) – HackerRank",
      issuer: "HackerRank",
      year: "2025",
      image: "/certificates/3SERTI.png",
      link: "https://www.hackerrank.com/certificates/86536e96d6c1",
    },
    {
      id: 4,
      title: "Python (Basic) - HackerRank",
      issuer: "HackerRank",
      year: "2025",
      image: "/certificates/4SERTI.png",
      link: "https://www.hackerrank.com/certificates/8e4aba765542",
    },
   
  ];

  
  const [visibleCount, setVisibleCount] = useState(3);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 3);

  return (
    <section id="certificates" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-primary text-3xl md:text-4xl font-bold mb-4 text-center">
          Certifications
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Here are some of my professional certifications and achievements that reflect my growth and commitment to continuous learning in technology and data.
        </p>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.slice(0, visibleCount).map((cert) => (
            <div
              key={cert.id}
              className="group bg-card rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold mb-1">{cert.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {cert.issuer} • {cert.year}
                </p>
                <a
                  href={cert.link}
                  target="_blank"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  View Certificate <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Load More */}
        {visibleCount < certificates.length && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="cosmic-button w-fit flex items-center mx-auto gap-2"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
