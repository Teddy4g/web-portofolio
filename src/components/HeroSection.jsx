import SplitText from "./SplitText";

export const HeroSection = () => {
  return (
    <section id="hero" className="scroll-mt-28 min-h-[88vh] flex items-center">
      <div className="max-w-6xl mx-auto px-6">
        <div className="uppercase tracking-[0.18em] text-xs text-neutral-500 mb-4">
          <SplitText text="PORTFOLIO" delay={0.2} />
        </div>

        <h1 className="font-extrabold tracking-tight leading-[1.05] text-[38px] sm:text-[48px] md:text-[72px] mb-4">
          <SplitText text="Hi, I'm Teddy Agustinus" delay={0.6} />
        </h1>

        <p className="text-[16px] sm:text-[18px] md:text-[20px] text-neutral-600 max-w-3xl">
          <SplitText
            text="I connect strategy, data, and technology to turn complex problems into user-centered solutions."
            delay={0.5}
          />
        </p>
      </div>
    </section>
  );
};
