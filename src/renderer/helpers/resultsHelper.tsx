import { isObject, sortBy } from 'lodash/fp';
import * as React from 'react';

import getMatchesWithAlternatives from './matchHelper';
import { ComponentData, ComponentMatch } from '../../common/types';

const numberOfMatchedRegions = (item: ComponentData): number =>
  item.matches!.reduce((acc: number, match: ComponentMatch): number => acc + (isObject(match) ? 1 : 0), 0);

const itemStartsWithSignificantMatch = (item: ComponentData): boolean => {
  const firstMatchAsObject = item.matches![0] as { matched: string }; // TODO: Tech debt
  return !(isObject(firstMatchAsObject) && firstMatchAsObject.matched.length > 1); // TODO: Tech debt
};

const alphabeticalSort = sortBy((item: ComponentData): string => item.displayName);

const numberOfRegionsSort = sortBy(numberOfMatchedRegions);

const startsWithSignificantMatchSort = sortBy(itemStartsWithSignificantMatch);

const sortItems = (list: ComponentData[]): ComponentData[] =>
  startsWithSignificantMatchSort(numberOfRegionsSort(alphabeticalSort(list)));

const createItemWithMatches = ({ ...itemProps }: ComponentData, searchValue: string): ComponentData => ({
  matches: getMatchesWithAlternatives(searchValue, itemProps.displayName, itemProps.alternatives!), // TODO: Tech debt
  ...itemProps,
});

const itemMatchesSearchValue = (item: ComponentData): boolean => (item.matches as ComponentMatch[]).some(isObject);

const findOrderedSearchResults = (items: ComponentData[], searchValue: string): ComponentData[] => {
  const itemsWithMatches = items.map((item: ComponentData): ComponentData => createItemWithMatches(item, searchValue));

  const results = sortItems(itemsWithMatches.filter(itemMatchesSearchValue));

  return results.map(
    ({ ...itemProps }: ComponentData): ComponentData => ({
      highlighted: (itemProps.matches as ComponentMatch[]).map(
        (match: ComponentMatch, index: number): React.ReactElement => {
          const matchAsObject = match as { matched: string };
          if (matchAsObject.matched) {
            const key = `match-${index}`;
            return <mark key={key}>{matchAsObject.matched.replace(/ /g, '-')}</mark>;
          }

          return <>{(match as string).replace(/ /g, '-')}</>;
        },
      ),
      ...itemProps,
    }),
  );
};

export default findOrderedSearchResults;
