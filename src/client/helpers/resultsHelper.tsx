import { assign, get, isObject, some, sortBy } from 'lodash/fp';
import * as React from 'react';

import getMatchesWithAlternatives from './matchHelper';

const numberOfMatchedRegions = (item: any) =>
  item.matches.reduce((acc: any, match: any) => acc + (isObject(match) ? 1 : 0), 0);

const itemStartsWithSignificantMatch = (item: any) =>
  !(isObject(item.matches[0]) && item.matches[0].matched.length > 1);

const alphabeticalSort = sortBy(get('displayName'));

const numberOfRegionsSort = sortBy(numberOfMatchedRegions);

const startsWithSignificantMatchSort = sortBy(itemStartsWithSignificantMatch);

const sortItems = (list: any[]) => startsWithSignificantMatchSort(numberOfRegionsSort(alphabeticalSort(list)));

const createItemWithMatches = (item: any, searchValue: string) =>
  assign(item, {
    matches: getMatchesWithAlternatives(searchValue, item.displayName, item.alternatives),
  });

const itemMatchesSearchValue = (item: any) => some(isObject)(item.matches);

const findOrderedSearchResults = (items: any[], searchValue: string) => {
  const itemsWithMatches = items.map((item: any) => createItemWithMatches(item, searchValue));

  const results = sortItems(itemsWithMatches.filter(itemMatchesSearchValue));

  return results.map((item: any) =>
    assign(item, {
      highlighted: item.matches.map((match: any, index: number) => {
        if (match.matched) {
          return <mark key={`match-${index}`}>{match.matched.replace(/ /g, '-')}</mark>;
        }

        return match.replace(/ /g, '-');
      }),
    }),
  );
};

export default findOrderedSearchResults;
