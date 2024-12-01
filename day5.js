var day5 = (() => {
    let arrayMiddle = (arr) => {
        assert(arr.length % 2 !== 0);
        return arr[Math.floor(arr.length / 2)];
    };

    let sumMiddleNumbersForCorrectedUpdatesOnly = rawInput => {
        let [rawOrders, rawUpdates] = rawInput.split(/\n\n/).filter(el => el);
        let beforeAfterPairsHash = {};
        rawOrders.split(/\n/).filter(el => el).forEach(pairStr => {
            let [before, after] = pairStr.split('|').map(n => parseInt(n, 10));
            beforeAfterPairsHash[before] = beforeAfterPairsHash[before] || {};
            beforeAfterPairsHash[before][after] = true;
        });

        // same as part one, but the filter returns true/false where it returned false/true
        // I guess javascript doesn't have something like `reject` or whatever it was in ruby
        let incorrectUpdates = rawUpdates.split(/\n/).filter(el => el).map(row => row.split(',').map(n => parseInt(n, 10)))
            .filter(row => {
                for (let i = 0; i < row.length - 1; i++) {
                    // ok, we need to see if any of the ones after row[i] have an instruction to come after row[i]
                    for (let j = i + 1; j < row.length; j++) {
                        if (beforeAfterPairsHash[row[j]] && beforeAfterPairsHash[row[j]][row[i]]) {
                            return true;
                        }
                    }
                }

                return false;
            });

        // now we need to get the corrected versions of the incorrect updates
        return incorrectUpdates.map(row => getCorrectedUpdate(row, beforeAfterPairsHash))
            .map(row => arrayMiddle(row)).reduce((a, e) => a + e, 0);
    };

    let getCorrectedUpdate = (row, beforeAfterPairsHash) => {
        // we want to go through the updates, same as before, but when we hit an invalid before/after
        // we move row[j] to come before row[i]

        for (let i = 0; i < row.length - 1; i++) {
            for (let j = i + 1; j < row.length; j++) {
                let before = row[i];
                let after = row[j];
                if (beforeAfterPairsHash[after] && beforeAfterPairsHash[after][before]) {
                    row.splice(j, 1);
                    row.splice(i, 0, after);
                    // we should have a look at the inbetween stuff again just in case?
                    j = i;
                }
            }
        }

        return row;
    };

    let sumMiddleNumbersForValidUpdates = rawInput => {
        let [rawOrders, rawUpdates] = rawInput.split(/\n\n/).filter(el => el);
        let beforeAfterPairsHash = {};
        rawOrders.split(/\n/).filter(el => el).forEach(pairStr => {
            let [before, after] = pairStr.split('|').map(n => parseInt(n, 10));
            beforeAfterPairsHash[before] = beforeAfterPairsHash[before] || {};
            beforeAfterPairsHash[before][after] = true;
        });

        let validUpdates = rawUpdates.split(/\n/).filter(el => el).map(row => row.split(',').map(n => parseInt(n, 10)))
            .filter(row => {
                for (let i = 0; i < row.length - 1; i++) {
                    // ok, we need to see if any of the ones after row[i] have an instruction to come after row[i]
                    for (let j = i + 1; j < row.length; j++) {
                        if (beforeAfterPairsHash[row[j]] && beforeAfterPairsHash[row[j]][row[i]]) {
                            return false;
                        }
                    }
                }

                return true;
            });

        // then find the middle number of each, sum those, and return it
        return validUpdates.map(row => arrayMiddle(row)).reduce((a, e) => a + e, 0);
    };

    return [sumMiddleNumbersForValidUpdates, sumMiddleNumbersForCorrectedUpdatesOnly];
})();
