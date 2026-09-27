import { createHash } from 'node:crypto';

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ',') {
      row.push(value);
      value = '';
    } else if (character === '\n') {
      row.push(value.replace(/\r$/, ''));
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = '';
    } else {
      value += character;
    }
  }

  if (quoted) throw new Error('CSV contains an unterminated quoted field.');
  if (value.length || row.length) {
    row.push(value.replace(/\r$/, ''));
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }
  return rows;
}

export function readQaRows(text) {
  const rows = parseCsv(text.replace(/^\uFEFF/, ''));
  if (rows.length < 2) throw new Error('CSV must contain a header and at least one Q&A row.');

  const headers = rows[0].map((header) => header.trim().toLowerCase());
  const questionIndex = headers.indexOf('question');
  const answerIndex = headers.indexOf('answer');
  if (questionIndex < 0 || answerIndex < 0) {
    throw new Error('CSV must contain question and answer columns.');
  }

  const seen = new Set();
  return rows.slice(1).map((cells, index) => {
    const question = (cells[questionIndex] || '').trim();
    const answer = (cells[answerIndex] || '').trim();
    if (!question || !answer) throw new Error(`CSV row ${index + 2} has a blank question or answer.`);

    const normalizedQuestion = question.toLocaleLowerCase('en-US').replace(/\s+/g, ' ');
    if (seen.has(normalizedQuestion)) throw new Error(`Duplicate question in CSV row ${index + 2}: ${question}`);
    seen.add(normalizedQuestion);
    return {
      _id: createHash('sha256').update(normalizedQuestion).digest('hex'),
      question,
      answer,
      content: `Question: ${question}\nAnswer: ${answer}`,
    };
  });
}
