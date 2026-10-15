// Conservative keyword retrieval keeps the saved Q&A usable during API outages.
// Unknown terms count against coverage so unrelated questions do not match merely
// because they mention Teddy.
const STOP_WORDS = new Set(`a an the is are was were be been being do does did
  can could would should will has have had i me my you your he him his they their
  it its this that these those of for to from in on at by with and or about
  what which who where when how tell please teddy ted s`.split(/\s+/));

const ALIASES = {
  studies: 'study', studying: 'study', education: 'study', educational: 'study',
  works: 'work', working: 'work', worked: 'work', employment: 'work',
  skills: 'technology', technologies: 'technology', tools: 'technology',
  projects: 'project', languages: 'language', publications: 'research',
  published: 'research', graduation: 'graduate', graduating: 'graduate',
  university: 'universitas', college: 'universitas',
};

function normalizeQuestion(text) {
  return text.toLowerCase().replace(/\bted\b/g, 'teddy')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function tokens(text) {
  return new Set(normalizeQuestion(text).split(/\s+/)
    .filter((word) => word && !STOP_WORDS.has(word))
    .map((word) => ALIASES[word] || word));
}

export function retrieveLocalMatches(query, index, topK = 5) {
  const exact = index.entries.find(({ question }) =>
    normalizeQuestion(question) === normalizeQuestion(query));
  if (exact) {
    const { id, question, answer } = exact;
    return [{ id, question, answer, score: 1, exact: true }];
  }

  const queryTokens = tokens(query);
  if (!queryTokens.size) return [];
  const documents = index.entries.map((entry) => ({
    entry,
    questionTokens: tokens(entry.question),
    allTokens: tokens(`${entry.question} ${entry.answer}`),
  }));
  const weights = new Map([...queryTokens].map((token) => {
    const frequency = documents.filter(({ allTokens }) => allTokens.has(token)).length;
    return [token, 1 + Math.log((documents.length + 1) / (frequency + 1))];
  }));
  const totalWeight = [...weights.values()].reduce((sum, weight) => sum + weight, 0);

  return documents.map(({ entry, questionTokens, allTokens }) => {
    let matchedWeight = 0;
    let questionWeight = 0;
    for (const [token, weight] of weights) {
      if (allTokens.has(token)) matchedWeight += weight;
      if (questionTokens.has(token)) questionWeight += weight;
    }
    const coverage = matchedWeight / totalWeight;
    const questionCoverage = questionWeight / totalWeight;
    return {
      id: entry.id, question: entry.question, answer: entry.answer,
      score: coverage * 0.8 + questionCoverage * 0.2,
      coverage,
    };
  })
    .filter(({ coverage }) => coverage >= 0.8)
    .sort((left, right) => right.score - left.score)
    .slice(0, topK)
    .map(({ coverage: _coverage, ...match }) => match);
}
