var day19 = (() => {
    let countWaysToMatchTargetPattern = (targetPattern, availableTowels, visitedPatterns = {}) => {
        if (visitedPatterns[targetPattern] !== undefined) {
            return visitedPatterns[targetPattern];
        }

        let result = 0;
        for (let i = 0; i < availableTowels.length; i++) {
            if (targetPattern === availableTowels[i]) {
                result++;
            }
        }

        for (let i = 0; i < availableTowels.length; i++) {
            let towel = availableTowels[i];
            if (
                towel.length <= targetPattern.length &&
                targetPattern.slice(0, towel.length) === towel
            ) {
                result += countWaysToMatchTargetPattern(targetPattern.slice(towel.length), availableTowels, visitedPatterns);
            }
        }

        visitedPatterns[targetPattern] = result;

        return result;
    };

    let countAllPossibleTowelArrangements = rawInput => {
        let [availableTowels, targetPatterns] = rawInput.split(/\n\n/).filter(el => el).map(str => str.match(/[a-z]+/g));

        return targetPatterns.map(targetPattern => countWaysToMatchTargetPattern(targetPattern, availableTowels))
            .reduce((a, e) => a + e, 0);
    };

    let canMatchTargetPattern = (targetPattern, availableTowels) => {
        for (let i = 0; i < availableTowels.length; i++) {
            if (targetPattern === availableTowels[i]) {
                return true;
            }
        }

        for (let i = 0; i < availableTowels.length; i++) {
            let towel = availableTowels[i];
            if (
                towel.length <= targetPattern.length &&
                targetPattern.slice(0, towel.length) === towel &&
                canMatchTargetPattern(targetPattern.slice(towel.length), availableTowels)
            ) {
                return true;
            }
        }

        return false;
    };

    let countPossibleTowelDesigns = rawInput => {
        let [availableTowels, targetPatterns] = rawInput.split(/\n\n/).filter(el => el).map(str => str.match(/[a-z]+/g));
        return targetPatterns.filter(targetPattern => canMatchTargetPattern(targetPattern, availableTowels)).length;
    };

    return [countPossibleTowelDesigns, countAllPossibleTowelArrangements];
})();
