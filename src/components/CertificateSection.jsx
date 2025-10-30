import { motion } from "framer-motion";

const certificates = [
  { id: 1, title: "SQL (Basic) – HackerRank", issuer: "HackerRank", image: "/certificates/1SERTI.png" },
  { id: 2, title: "SQL (Intermediate) – HackerRank", issuer: "HackerRank", image: "/certificates/2SERTI.png" },
  { id: 3, title: "SQL (Advanced) – HackerRank", issuer: "HackerRank", image: "/certificates/3SERTI.png" },
  { id: 4, title: "Python (Basic) - HackerRank", issuer: "HackerRank", image: "/certificates/4SERTI.png" },
];


export const CertificateSection = () => {
  return (
    <section id="certificates" className="scroll-mt-28">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-8 md:mb-10"
        >
          Certificates
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {certificates.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22,1,0.36,1] }}
              className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm"
            >
              <img src={c.image} alt={c.title} loading="lazy" className="w-full h-44 md:h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-neutral-600">{c.issuer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
