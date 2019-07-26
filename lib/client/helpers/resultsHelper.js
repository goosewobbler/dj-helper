"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fp_1 = require("lodash/fp");
var React = require("react");
var matchHelper_1 = require("./matchHelper");
var numberOfMatchedRegions = function (item) {
    return item.matches.reduce(function (acc, match) { return acc + (fp_1.isObject(match) ? 1 : 0); }, 0);
};
var itemStartsWithSignificantMatch = function (item) {
    return !(fp_1.isObject(item.matches[0]) && item.matches[0].matched.length > 1);
};
var alphabeticalSort = fp_1.sortBy(fp_1.get('displayName'));
var numberOfRegionsSort = fp_1.sortBy(numberOfMatchedRegions);
var startsWithSignificantMatchSort = fp_1.sortBy(itemStartsWithSignificantMatch);
var sortItems = function (list) { return startsWithSignificantMatchSort(numberOfRegionsSort(alphabeticalSort(list))); };
var createItemWithMatches = function (item, searchValue) {
    return fp_1.assign(item, {
        matches: matchHelper_1.default(searchValue, item.displayName, item.alternatives),
    });
};
var itemMatchesSearchValue = function (item) { return fp_1.some(fp_1.isObject)(item.matches); };
var findOrderedSearchResults = function (items, searchValue) {
    var itemsWithMatches = items.map(function (item) { return createItemWithMatches(item, searchValue); });
    var results = sortItems(itemsWithMatches.filter(itemMatchesSearchValue));
    return results.map(function (item) {
        return fp_1.assign(item, {
            highlighted: item.matches.map(function (match, index) {
                if (match.matched) {
                    return React.createElement("mark", { key: "match-" + index }, match.matched.replace(/ /g, '-'));
                }
                return match.replace(/ /g, '-');
            }),
        });
    });
};
exports.default = findOrderedSearchResults;
//# sourceMappingURL=resultsHelper.js.map