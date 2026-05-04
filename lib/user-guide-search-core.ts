export type UserGuideSearchField = 'content' | 'description' | 'navLabel' | 'title';

export interface UserGuideSearchEntry {
  content: string;
  description: string;
  groupLabel: string;
  id: string;
  navLabel: string;
  path: string;
  title: string;
}

export interface UserGuideSearchHighlight {
  end: number;
  start: number;
}

export interface UserGuideSearchResult extends UserGuideSearchEntry {
  excerpt: string;
  highlights: UserGuideSearchHighlight[];
  matchedField: UserGuideSearchField;
}

interface SearchOptions {
  currentPageId?: string;
  limit?: number;
}

interface FieldMatch {
  field: UserGuideSearchField;
  matchedPhrase: boolean;
  rawIndex: number;
  score: number;
}

const DEFAULT_RESULT_LIMIT = 8;
const EXCERPT_RADIUS = 72;

const fieldWeights: Record<UserGuideSearchField, number> = {
  title: 400,
  navLabel: 350,
  description: 250,
  content: 100,
};

export function normalizeGuideSearchText(value: string) {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function getEntryField(entry: UserGuideSearchEntry, field: UserGuideSearchField) {
  return entry[field];
}

function getRawMatchIndex(value: string, query: string, tokens: string[]) {
  const normalizedValue = value.normalize('NFKC').toLocaleLowerCase();
  const normalizedQuery = query.trim().normalize('NFKC').toLocaleLowerCase();
  const phraseIndex = normalizedValue.indexOf(normalizedQuery);

  if (phraseIndex >= 0) {
    return phraseIndex;
  }

  for (const token of tokens) {
    const tokenIndex = normalizedValue.indexOf(token);

    if (tokenIndex >= 0) {
      return tokenIndex;
    }
  }

  return 0;
}

function findFieldMatch(
  entry: UserGuideSearchEntry,
  query: string,
  normalizedQuery: string,
  tokens: string[],
): FieldMatch | null {
  const fields: UserGuideSearchField[] = [
    'title',
    'navLabel',
    'description',
    'content',
  ];

  for (const field of fields) {
    const value = getEntryField(entry, field);
    const normalizedValue = normalizeGuideSearchText(value);
    const matchedPhrase = normalizedValue.includes(normalizedQuery);
    const matchedTokens =
      tokens.length > 0 && tokens.every((token) => normalizedValue.includes(token));

    if (!matchedPhrase && !matchedTokens) {
      continue;
    }

    return {
      field,
      matchedPhrase,
      rawIndex: getRawMatchIndex(value, query, tokens),
      score: fieldWeights[field] + (matchedPhrase ? 80 : 40),
    };
  }

  return null;
}

function createExcerpt(value: string, rawIndex: number, field: UserGuideSearchField) {
  if (field !== 'content' || value.length <= EXCERPT_RADIUS * 2) {
    return value;
  }

  const start = Math.max(0, rawIndex - EXCERPT_RADIUS);
  const end = Math.min(value.length, rawIndex + EXCERPT_RADIUS);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < value.length ? '...' : '';

  return `${prefix}${value.slice(start, end).trim()}${suffix}`;
}

function createHighlights(excerpt: string, query: string, tokens: string[]) {
  const normalizedExcerpt = excerpt.normalize('NFKC').toLocaleLowerCase();
  const normalizedQuery = query.trim().normalize('NFKC').toLocaleLowerCase();
  const phraseIndex = normalizedExcerpt.indexOf(normalizedQuery);

  if (phraseIndex >= 0) {
    return [
      {
        end: phraseIndex + normalizedQuery.length,
        start: phraseIndex,
      },
    ];
  }

  const firstMatch = tokens
    .map((token) => ({
      index: normalizedExcerpt.indexOf(token),
      token,
    }))
    .filter((match) => match.index >= 0)
    .sort((left, right) => left.index - right.index)[0];

  if (!firstMatch) {
    return [];
  }

  return [
    {
      end: firstMatch.index + firstMatch.token.length,
      start: firstMatch.index,
    },
  ];
}

export function searchUserGuideEntries(
  entries: UserGuideSearchEntry[],
  query: string,
  options: SearchOptions = {},
): UserGuideSearchResult[] {
  const normalizedQuery = normalizeGuideSearchText(query);

  if (!normalizedQuery) {
    return [];
  }

  const tokens = normalizedQuery.split(' ').filter(Boolean);
  const limit = options.limit ?? DEFAULT_RESULT_LIMIT;

  return entries
    .flatMap((entry) => {
      const match = findFieldMatch(entry, query, normalizedQuery, tokens);

      if (!match) {
        return [];
      }

      const fieldValue = getEntryField(entry, match.field);
      const excerpt = createExcerpt(fieldValue, match.rawIndex, match.field);
      const score =
        match.score + (entry.id === options.currentPageId ? 25 : 0);

      return [
        {
          ...entry,
          excerpt,
          highlights: createHighlights(excerpt, query, tokens),
          matchedField: match.field,
          score,
        },
      ];
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.title.localeCompare(right.title);
    })
    .slice(0, limit)
    .map(({ score: _score, ...result }) => result);
}
