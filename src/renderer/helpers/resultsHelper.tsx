import { assign, get, isObject, some, sortBy } from 'lodash/fp';
import * as React from 'react';

import getMatchesWithAlternatives from './matchHelper';
import { ComponentData, ComponentMatch } from '../../common/types';

const numberOfMatchedRegions = (item: ComponentData): number =>
  item.matches!.reduce((acc: number, match: ComponentMatch): number => acc + (isObject(match) ? 1 : 0), 0);

const itemStartsWithSignificantMatch = (item: ComponentData): boolean => {
  const firstMatchAsObject = item.matches![0] as { matched: string };
  return !(isObject(firstMatchAsObject) && firstMatchAsObject.matched.length > 1);
};

const alphabeticalSort = sortBy(get('displayName'));

const numberOfRegionsSort = sortBy(numberOfMatchedRegions);

const startsWithSignificantMatchSort = sortBy(itemStartsWithSignificantMatch);

const sortItems = (list: ComponentData[]): ComponentData[] =>
  startsWithSignificantMatchSort(numberOfRegionsSort(alphabeticalSort(list)));

const createItemWithMatches = (item: ComponentData, searchValue: string): ComponentData =>
  assign(item, {
    matches: getMatchesWithAlternatives(searchValue, item.displayName, item.alternatives!),
  });

const itemMatchesSearchValue = (item: ComponentData): boolean => some(isObject)(item.matches);

const findOrderedSearchResults = (items: ComponentData[], searchValue: string): ComponentData[] => {
  const itemsWithMatches = items.map((item: ComponentData): ComponentData => createItemWithMatches(item, searchValue));

  const results = sortItems(itemsWithMatches.filter(itemMatchesSearchValue));

  return results.map(
    (item: ComponentData): ComponentData =>
      assign(item, {
        highlighted: item.matches!.map(
          (match: ComponentMatch, index: number): React.ReactElement => {
            const matchAsObject = match as { matched: string };
            if (matchAsObject.matched) {
              const key = `match-${index}`;
              return <mark key={key}>{matchAsObject.matched.replace(/ /g, '-')}</mark>;
            }

            return <>{(match as string).replace(/ /g, '-')}</>;
          },
        ),
      }),
  );
};

export default findOrderedSearchResults;
