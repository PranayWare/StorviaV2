export function tokenize(text) {
  return text.toLowerCase().match(/\b\w+\b/g) || [];
}

export function normalize(word) {
  // Simple stemming: remove common suffixes
  const suffixes = ['ing', 'ly', 'ed', 'ies', 'ied', 'ies', 'ied', 's'];
  for (const suffix of suffixes) {
    if (word.endsWith(suffix) && word.length > suffix.length + 1) {
      return word.slice(0, -suffix.length);
    }
  }
  // Handle ies -> y
  if (word.endsWith('ies')) {
    return word.slice(0, -3) + 'y';
  }
  return word;
}

export function fuzzyMatch(word, pattern, threshold = 0.8) {
  // Simple fuzzy match using Levenshtein distance approximation
  if (word === pattern) return 1;
  if (word.includes(pattern) || pattern.includes(word)) return 0.9;

  const longer = word.length > pattern.length ? word : pattern;
  const shorter = word.length > pattern.length ? pattern : word;
  const distance = longer.length - shorter.length;
  if (distance > longer.length * (1 - threshold)) return 0;

  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  return matches / shorter.length;
}

export function scoreIntent(message, intent) {
  const tokens = tokenize(message).map(normalize);
  if (tokens.length === 0) return 0;

  let totalScore = 0;
  let matchedPatterns = 0;

  for (const pattern of intent.patterns) {
    const patternTokens = tokenize(pattern).map(normalize);
    let patternScore = 0;
    let matchedTokens = 0;

    for (const token of tokens) {
      for (const pToken of patternTokens) {
        const matchScore = fuzzyMatch(token, pToken);
        if (matchScore > 0.7) {
          patternScore += matchScore;
          matchedTokens++;
          break;
        }
      }
    }

    if (matchedTokens > 0) {
      patternScore /= matchedTokens; // average match score
      totalScore += patternScore;
      matchedPatterns++;
    }
  }

  if (matchedPatterns === 0) return 0;
  return totalScore / matchedPatterns; // average pattern score
}