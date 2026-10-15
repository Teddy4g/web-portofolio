import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import knowledgeIndex from '../../data/teddy_knowledge.json' with { type: 'json' };
import { retrieveLocalMatches } from './local-retrieval.js';

export const GREETING_MESSAGE = "anything about teddy's i'll answer";
export const OUT_OF_CONTEXT_MESSAGE = 'Better Ask Teddy directly through contact on the website';

const GREETINGS = new Set(['hi', 'hello', 'hey', 'hai', 'halo']);

const DEFAULTS = Object.freeze({
  embeddingModel: 'text-embedding-3-small',
  embeddingDimensions: 1536,
  geminiModel: 'gemini-3.5-flash-lite',
  topK: 5,
  minScore: 0.6,
});

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseScore(value, fallback) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : fallback;
}

export function getRagConfig(env = process.env) {
  return {
    openaiApiKey: env.OPENAI_API_KEY?.trim() || '',
    geminiApiKey: env.GEMINI_API_KEY?.trim() || '',
    embeddingModel: env.OPENAI_EMBEDDING_MODEL?.trim() || DEFAULTS.embeddingModel,
    embeddingDimensions: parsePositiveInteger(
      env.OPENAI_EMBEDDING_DIMENSIONS,
      DEFAULTS.embeddingDimensions,
    ),
    geminiModel: env.GEMINI_CHAT_MODEL?.trim() || DEFAULTS.geminiModel,
    topK: parsePositiveInteger(env.JSON_RAG_TOP_K, DEFAULTS.topK),
    minScore: parseScore(env.JSON_RAG_MIN_SCORE, DEFAULTS.minScore),
  };
}

function embeddingOptions(config, input) {
  return {
    model: config.embeddingModel,
    input,
    dimensions: config.embeddingDimensions,
  };
}

export function cosineSimilarity(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return 0;

  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dotProduct += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) return 0;
  return dotProduct / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

export function buildContext(matches) {
  return matches
    .map(
      (match, index) =>
        `[${index + 1}] Question: ${match.question}\nAnswer: ${match.answer}`,
    )
    .join('\n\n');
}

export function buildAnswerInput(query, matches) {
  return `Visitor question:\n${query}\n\nRetrieved Q&A context:\n${buildContext(matches)}`;
}

export function isGreeting(query) {
  const normalized = query
    .toLowerCase()
    .replace(/[^a-z]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
  return GREETINGS.has(normalized);
}

export function isGeminiQuotaError(error) {
  if (error?.status === 429 || error?.statusCode === 429 || error?.code === 429) return true;
  const description = [error?.name, error?.message, error?.code]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return /resource_exhausted|quota[_ -]?exceeded|rate[_ -]?limit|too many requests|\b429\b/.test(
    description,
  );
}

function validateKnowledgeIndex(index, config) {
  if (!Array.isArray(index?.entries) || index.entries.length === 0) {
    throw new Error('The JSON knowledge index is empty or invalid.');
  }
  if (index.embeddingModel !== config.embeddingModel) {
    throw new Error(
      `JSON knowledge index uses ${index.embeddingModel}, but the configured model is ${config.embeddingModel}.`,
    );
  }
  if (index.embeddingDimensions !== config.embeddingDimensions) {
    throw new Error(
      `JSON knowledge index uses ${index.embeddingDimensions} dimensions, but the configured value is ${config.embeddingDimensions}.`,
    );
  }
}

export async function retrieveMatches(query, config, dependencies = {}) {
  const index = dependencies.knowledgeIndex || knowledgeIndex;
  validateKnowledgeIndex(index, config);

  const openai = dependencies.openai || new OpenAI({
    apiKey: config.openaiApiKey, timeout: 8_000, maxRetries: 0,
  });
  const response = await openai.embeddings.create(embeddingOptions(config, query));
  const queryVector = response.data?.[0]?.embedding;
  if (!Array.isArray(queryVector) || queryVector.length === 0) {
    throw new Error('OpenAI returned an empty query embedding.');
  }

  return index.entries
    .map(({ id, question, answer, embedding }) => ({
      id,
      question,
      answer,
      score: cosineSimilarity(queryVector, embedding),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, config.topK);
}

export async function generateGroundedAnswer(query, matches, config, dependencies = {}) {
  if (!config.geminiApiKey && !dependencies.gemini) {
    return { answer: matches[0].answer, quotaExhausted: false, localAnswer: true };
  }
  try {
    const gemini = dependencies.gemini || new GoogleGenAI({
      apiKey: config.geminiApiKey,
      httpOptions: { timeout: 8_000, retryOptions: { attempts: 1 } },
    });
    const response = await gemini.models.generateContent({
      model: config.geminiModel,
      contents: buildAnswerInput(query, matches),
      config: {
        systemInstruction: [
          "You are Teddy Agustinus's portfolio assistant.",
          'Answer the visitor using only the retrieved Q&A context.',
          'Do not add facts, dates, employers, achievements, or technologies that are absent from the context.',
          `If the context cannot answer the question, reply exactly: ${OUT_OF_CONTEXT_MESSAGE}`,
          'Answer in the same language as the visitor. Be concise and natural.',
        ].join(' '),
        temperature: 0.2,
        maxOutputTokens: 512,
      },
    });

    const answer = response.text?.trim();
    if (!answer) throw new Error('Gemini returned an empty grounded answer.');
    return { answer, quotaExhausted: false };
  } catch (error) {
    console.error('[JSON RAG generation unavailable]', error);
    return {
      answer: matches[0].answer,
      quotaExhausted: isGeminiQuotaError(error),
      localAnswer: true,
    };
  }
}

export async function answerWithJsonRag(query, env = process.env, dependencies = {}) {
  if (isGreeting(query)) {
    return {
      match: false,
      fallback: false,
      greeting: true,
      answer: GREETING_MESSAGE,
      matches: [],
    };
  }

  const config = getRagConfig(env);
  const index = dependencies.knowledgeIndex || knowledgeIndex;
  const localMatches = retrieveLocalMatches(query, index, config.topK);
  let relevantMatches = localMatches;
  let localRetrieval = true;

  // Exact saved questions need no query embedding. For other wording, prefer
  // semantic retrieval and retain keyword matches if the provider is unavailable
  // or its similarity threshold excludes an otherwise supported question.
  if (!localMatches[0]?.exact && (config.openaiApiKey || dependencies.openai)) {
    try {
      const matches = await retrieveMatches(query, config, dependencies);
      const semanticMatches = matches.filter((match) => match.score >= config.minScore);
      if (semanticMatches.length) {
        relevantMatches = semanticMatches;
        localRetrieval = false;
      }
    } catch (error) {
      console.error('[JSON RAG embedding unavailable]', error);
    }
  }

  if (relevantMatches.length === 0) {
    return {
      match: false,
      fallback: true,
      answer: OUT_OF_CONTEXT_MESSAGE,
      matches: [],
      config,
    };
  }

  const generation = await generateGroundedAnswer(query, relevantMatches, config, dependencies);
  return {
    match: true,
    fallback: false,
    answer: generation.answer,
    quotaExhausted: generation.quotaExhausted,
    localAnswer: Boolean(generation.localAnswer),
    localRetrieval,
    matches: relevantMatches,
    config,
  };
}
