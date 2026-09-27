import React, { useState, useEffect } from 'react';
import { QUICK_ANSWERS } from '../data/chatbotTemplates.js';

const GREETINGS = [
  { text: "你好!", lang: "Chinese" },
  { text: "Hello!", lang: "English" },
  { text: "¡Hola!", lang: "Spanish" },
  { text: "こんにちは!", lang: "Japanese" },
  { text: "Bonjour!", lang: "French" },
  { text: "Halo!", lang: "Indonesian" },
  { text: "Ciao!", lang: "Italian" },
  { text: "Salam!", lang: "Arabic" },
  { text: "Olá!", lang: "Portuguese" },
  { text: "Namaste!", lang: "Hindi" },
];

export default function Hero({ onAsk }) {
  const [index, setIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');
  const [inputQuery, setInputQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % GREETINGS.length);
        setFadeState('fade-in');
      }, 350);
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      onAsk(inputQuery.trim());
      setInputQuery('');
    }
  };

  const handleChipClick = (template) => {
    onAsk(template.prompt, template);
  };

  return (
    <section className="hero-section" id="hero">
      <div className="hero-container">
        {/* Dynamic Rotator Greeting Title */}
        <div className="greeting-wrapper">
          <h1 className={`greeting-title ${fadeState}`}>
            {GREETINGS[index].text}
          </h1>
          <span className="language-badge">{GREETINGS[index].lang}</span>
        </div>

        {/* Headline & Subtitle */}
        <h2 className="hero-name">I'm Teddy Agustinus</h2>
        <p className="hero-subtitle">
           A lifelong learner turning curiosity into code and data into impact.
        </p>

        {/* Interactive Search / Ask Box */}
        <div className="ask-box-container">
          <form className="ask-form" onSubmit={handleSubmit}>
            <div className="ask-input-wrapper">
              <input
                type="text"
                className="ask-input"
                placeholder="Ask anything about Ted!"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="send-btn">
                <span>Send</span>
              </button>
            </div>
          </form>

          {/* Suggestion Chips */}
          <div className="suggestion-chips">
            {QUICK_ANSWERS.map((template) => (
              <button
                key={template.id}
                className="chip"
                onClick={() => handleChipClick(template)}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
