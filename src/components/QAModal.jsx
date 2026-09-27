import React, { useEffect, useRef, useState } from 'react';
import { Brain, X } from 'lucide-react';
import { ragSearchJson } from '../utils/ragSearchJson.js';

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  DONE: 'done',
  ERROR: 'error',
  NO_MATCH: 'no_match',
};

export default function QAModal({ isOpen, onClose, query, templateAnswer = null }) {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [answer, setAnswer] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [typedText, setTypedText] = useState('');
  const abortRef = useRef(false);
  const typingRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !query) return undefined;

    abortRef.current = false;
    if (typingRef.current) clearInterval(typingRef.current);
    setAnswer(null);
    setTypedText('');
    setErrorMsg('');
    setStatus(STATUS.LOADING);

    const presentAnswer = (top) => {
      setAnswer(top);
      setStatus(STATUS.DONE);

      const fullText = top.chunk.text;
      let position = 0;
      typingRef.current = setInterval(() => {
        if (abortRef.current) {
          clearInterval(typingRef.current);
          return;
        }
        position += 4;
        setTypedText(fullText.slice(0, position));
        if (position >= fullText.length) clearInterval(typingRef.current);
      }, 10);
    };

    if (templateAnswer) {
      presentAnswer({
        chunk: {
          id: `template-${templateAnswer.id}`,
          category: templateAnswer.category,
          text: templateAnswer.answer,
        },
        score: 1,
        latencyMs: 0,
        source: 'Local template response',
        template: true,
      });

      return () => {
        abortRef.current = true;
        if (typingRef.current) clearInterval(typingRef.current);
      };
    }

    (async () => {
      try {
        const results = await ragSearchJson(query);
        if (abortRef.current) return;

        if (!results.length) {
          setStatus(STATUS.NO_MATCH);
          return;
        }

        const top = results[0];
        if (top.fallback) {
          setAnswer(top);
          setStatus(STATUS.NO_MATCH);
          return;
        }

        presentAnswer(top);
      } catch (error) {
        if (!abortRef.current) {
          console.error('[JSON RAG error]', error);
          setErrorMsg(error.message || 'Unknown error');
          setStatus(STATUS.ERROR);
        }
      }
    })();

    return () => {
      abortRef.current = true;
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, [isOpen, query, templateAnswer]);

  if (!isOpen) return null;

  return (
    <div className="qa-modal active">
      <div className="qa-overlay" onClick={onClose}></div>
      <div className="qa-container">
        <div className="qa-header">
          <div className="qa-title-box">
            <span className="qa-bot-badge">
              <Brain size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Teddy&apos;s Personal Assistant
            </span>
            <h3 className="qa-user-query">&quot;{query}&quot;</h3>
          </div>
          <button className="qa-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="qa-body">
          {status === STATUS.LOADING && (
            <div className="rag-status">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
              <p className="rag-status-text">Searching Teddy&apos;s knowledge base…</p>
            </div>
          )}

          {status === STATUS.ERROR && (
            <div className="rag-no-match">
              <p>{errorMsg || 'Something went wrong.'}</p>
            </div>
          )}

          {status === STATUS.NO_MATCH && (
            <div className="rag-no-match">
              <p>{answer?.chunk.text || 'Better Ask Teddy directly through contact on the website'}</p>
            </div>
          )}

          {status === STATUS.DONE && answer && (
            <div className="rag-answer">
              <div className="rag-answer-meta">
                <span className="rag-category-badge">{answer.chunk.category}</span>
              </div>

              <div style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: '0.4rem',
              }}>
                Answer:
              </div>
              <p className="rag-answer-text" style={{ whiteSpace: 'pre-line' }}>
                {typedText}
                {typedText.length < answer.chunk.text.length && (
                  <span className="typing-cursor">▋</span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="qa-footer">
          <span className="qa-note">
            <Brain size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Answers are based on Teddy&apos;s portfolio.
          </span>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
