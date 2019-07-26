import { deburr, find, isObject, some, trim } from 'lodash/fp';

const normalise = (value: string): string => deburr(value.toLowerCase());

const getNeedleSubstring = (needle: string, haystack: string) => {
  const normalisedNeedle = normalise(needle);
  const normalisedHaystack = normalise(haystack);
  const indexOfFirstNeedleCharacter = normalisedHaystack.indexOf(normalisedNeedle[0]);

  let length = 0;

  if (indexOfFirstNeedleCharacter > -1) {
    length = 1;
    while (
      length < normalisedNeedle.length &&
      normalisedHaystack[indexOfFirstNeedleCharacter + length] === normalisedNeedle[length]
    ) {
      length += 1;
    }
  }

  return { indexOfFirstNeedleCharacter, length };
};

const getMatchesRecursive = (needle: string, haystack: string): Array<string | { matched: string }> => {
  const { indexOfFirstNeedleCharacter, length } = getNeedleSubstring(needle, haystack);

  if (length === 0) {
    return [haystack];
  }

  const start = haystack.substr(0, indexOfFirstNeedleCharacter);
  const matched = haystack.substr(indexOfFirstNeedleCharacter, length);
  const end = haystack.substr(indexOfFirstNeedleCharacter + length);

  return [start, { matched }].concat(getMatchesRecursive(needle.substr(length), end)).filter(Boolean);
};

const getMatches = (needle: string, haystack: string) => {
  const trimmedNeedle = trim(needle);
  const matches = getMatchesRecursive(trimmedNeedle, haystack);
  const matchedParts = matches.filter(match => typeof match === 'object') as Array<{ matched: string }>;
  const combinedMatchedParts = matchedParts.reduce((acc, match) => acc + match.matched, '');

  if (combinedMatchedParts.length !== trimmedNeedle.length) {
    return [haystack];
  }

  return matches;
};

const getMatchesWithAlternatives = (needle: string, haystack: string, alternatives: string[]) => {
  const matches = getMatches(needle, haystack);

  if (some(isObject)(matches)) {
    return matches;
  }

  const alternativeMatches = alternatives.map(alternative => getMatches(needle, alternative));
  return find(some(isObject), alternativeMatches);
};

export default getMatchesWithAlternatives;
