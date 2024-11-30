var day1 = (() => {
    let sumSimilarityScores = (rawInput) => {
        let pairs = rawInput.split(/\n/).filter(el => el)
            .map(row => row.split(/\s+/).map(n => parseInt(n, 10)));
        let firstList = [];
        let secondList = [];
        pairs.forEach(pair => {
            firstList.push(pair[0]);
            secondList.push(pair[1]);
        });

        let secondListCounts = {};
        secondList.forEach(num => {
            secondListCounts[num] = secondListCounts[num] ? secondListCounts[num] + 1 : 1;
        });

        return firstList.map(num => num * (secondListCounts[num] || 0)).reduce((a, e) => a + e, 0);
    };

    let sumDistanceBetweenSortedPairs = (rawInput) => {
        let pairs = rawInput.split(/\n/).filter(el => el)
            .map(row => row.split(/\s+/).map(n => parseInt(n, 10)));
        let firstList = [];
        let secondList = [];
        pairs.forEach(pair => {
            firstList.push(pair[0]);
            secondList.push(pair[1]);
        });
        firstList = numericSortLowestToHighest(firstList);
        secondList = numericSortLowestToHighest(secondList);

        return firstList.map((num, i) => Math.abs(num - secondList[i])).reduce((a, e) => a + e, 0);
    };

    return [sumDistanceBetweenSortedPairs, sumSimilarityScores];
})();
