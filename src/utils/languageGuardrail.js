/**
 * Language Guardrail — Detects whether a query is in English.
 *
 * Strategy: two-pass check
 *
 * Pass 1 — Script check (catches Arabic, Chinese, Japanese, Korean, Thai, etc.)
 *   If the query contains characters outside Basic Latin + Latin Extended,
 *   it's definitely not English.
 *
 * Pass 2 — Word-list check (catches Indonesian/Malay which use Latin alphabet)
 *   Check against a curated list of high-frequency Indonesian words that
 *   never appear in English. Short, fast, zero dependencies.
 *
 * Why not a library (franc, langdetect)?
 *   - franc needs ~60+ chars to be reliable; portfolio queries are often short
 *   - Word-list is deterministic and tuned exactly for EN vs ID use case
 *
 * Returns: { isEnglish: boolean, reason: string }
 */

// High-frequency Indonesian/Malay words that don't appear in English.
// Covers pronouns, question words, conjunctions, verbs, prepositions.
const INDONESIAN_WORDS = new Set([
  // Question words
  'dimana', 'kemana', 'darimana', 'kenapa', 'mengapa', 'bagaimana',
  'kapan', 'siapa', 'berapa', 'apakah', 'apa',
  // Pronouns
  'saya', 'aku', 'kamu', 'anda', 'dia', 'mereka', 'kami', 'kita',
  // Common verbs
  'adalah', 'bekerja', 'belajar', 'tinggal', 'berdomisili', 'kuliah',
  'membangun', 'mengerjakan', 'melakukan', 'memiliki', 'mau', 'bisa',
  'boleh', 'harus', 'akan', 'sedang', 'sudah', 'pernah', 'belum',
  // Conjunctions & particles
  'dan', 'atau', 'tetapi', 'tapi', 'karena', 'supaya', 'agar',
  'bahwa', 'yang', 'dengan', 'untuk', 'dari', 'kepada', 'terhadap',
  'oleh', 'pada', 'dalam', 'tentang', 'mengenai', 'antara',
  // Articles & demonstratives
  'ini', 'itu', 'tersebut', 'ada', 'tidak', 'tak', 'bukan', 'juga',
  // Nouns (common in portfolio queries)
  'keahlian', 'pengalaman', 'proyek', 'pekerjaan', 'skripsi', 'magang',
  'sekolah', 'universitas', 'kontak', 'hubungi', 'tinggal', 'kota',
]);

/**
 * Returns true if the text contains non-Latin characters
 * (Arabic, Chinese, Japanese, Korean, Thai, Cyrillic, etc.)
 */
function hasNonLatinScript(text) {
  // Allow: Basic Latin, Latin Extended A/B, common punctuation & digits
  // Block: anything in Unicode blocks beyond U+024F (except whitespace)
  return /[^\u0000-\u024F\s]/u.test(text);
}

/**
 * Main guardrail function.
 *
 * @param {string} query - The user's raw query string
 * @returns {{ isEnglish: boolean, reason: string }}
 */
export function detectLanguage(query) {
  if (!query || query.trim().length === 0) {
    return { isEnglish: false, reason: 'empty' };
  }

  const trimmed = query.trim();

  // Pass 1: Non-Latin script detection
  if (hasNonLatinScript(trimmed)) {
    return {
      isEnglish: false,
      reason: 'non_latin_script',
    };
  }

  // Pass 2: Indonesian word-list detection
  // Normalize: lowercase, remove punctuation, split into words
  const words = trimmed
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  const indonesianMatches = words.filter(w => INDONESIAN_WORDS.has(w));

  // If any word matches the Indonesian list, flag it.
  // Single-word queries like "apa" are caught here.
  if (indonesianMatches.length > 0) {
    return {
      isEnglish: false,
      reason: 'indonesian_detected',
      matchedWords: indonesianMatches,
    };
  }

  // Passed both checks — treat as English
  return { isEnglish: true, reason: 'passed' };
}
