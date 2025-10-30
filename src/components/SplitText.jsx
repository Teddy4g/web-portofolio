import { motion } from "framer-motion";

export default function SplitText({ text, delay = 0, className = "" }) {
  const characters = text.split("");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04, 
        delayChildren: delay,
      },
    },
  };

  const letter = {
    hidden: {
      opacity: 0,
      y: -35,
      filter: "blur(6px)"
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {characters.map((char, i) => (
        <motion.span
          key={i}
          variants={letter}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
