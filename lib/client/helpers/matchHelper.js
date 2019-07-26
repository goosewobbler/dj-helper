"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fp_1 = require("lodash/fp");
var normalise = function (value) { return fp_1.deburr(value.toLowerCase()); };
var getNeedleSubstring = function (needle, haystack) {
    var normalisedNeedle = normalise(needle);
    var normalisedHaystack = normalise(haystack);
    var indexOfFirstNeedleCharacter = normalisedHaystack.indexOf(normalisedNeedle[0]);
    var length = 0;
    if (indexOfFirstNeedleCharacter > -1) {
        length = 1;
        while (length < normalisedNeedle.length &&
            normalisedHaystack[indexOfFirstNeedleCharacter + length] === normalisedNeedle[length]) {
            length += 1;
        }
    }
    return { indexOfFirstNeedleCharacter: indexOfFirstNeedleCharacter, length: length };
};
var getMatchesRecursive = function (needle, haystack) {
    var _a = getNeedleSubstring(needle, haystack), indexOfFirstNeedleCharacter = _a.indexOfFirstNeedleCharacter, length = _a.length;
    if (length === 0) {
        return [haystack];
    }
    var start = haystack.substr(0, indexOfFirstNeedleCharacter);
    var matched = haystack.substr(indexOfFirstNeedleCharacter, length);
    var end = haystack.substr(indexOfFirstNeedleCharacter + length);
    return [start, { matched: matched }].concat(getMatchesRecursive(needle.substr(length), end)).filter(Boolean);
};
var getMatches = function (needle, haystack) {
    var trimmedNeedle = fp_1.trim(needle);
    var matches = getMatchesRecursive(trimmedNeedle, haystack);
    var matchedParts = matches.filter(function (match) { return typeof match === 'object'; });
    var combinedMatchedParts = matchedParts.reduce(function (acc, match) { return acc + match.matched; }, '');
    if (combinedMatchedParts.length !== trimmedNeedle.length) {
        return [haystack];
    }
    return matches;
};
var getMatchesWithAlternatives = function (needle, haystack, alternatives) {
    var matches = getMatches(needle, haystack);
    if (fp_1.some(fp_1.isObject)(matches)) {
        return matches;
    }
    var alternativeMatches = alternatives.map(function (alternative) { return getMatches(needle, alternative); });
    return fp_1.find(fp_1.some(fp_1.isObject), alternativeMatches);
};
exports.default = getMatchesWithAlternatives;
//# sourceMappingURL=matchHelper.js.map