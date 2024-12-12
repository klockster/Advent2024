var day13 = (() => {
    let findFewestTokensABitFurtherOut = rawInput => {
        let machines = rawInput.split(/\n\n/).filter(el => el).map(machine => {
            return machine.split(/\n/).filter(el => el).map(row => row.match(/\d+/g).map(n => parseInt(n, 10)))
                .map((row, i) => {
                    if (i < 2) {
                        return row;
                    }

                    return [row[0] + 10000000000000, row[1] + 10000000000000];
                });
        });

        return machines.map(m => getTokensToWin(m)).reduce((a, e) => a + e, 0);
    };

    // machine is a 3x2 array, where the first 2 rows are the button moves and the 3rd is the prize location
    let getTokensToWin = machine => {
        // basically, you're trying to find two values, N and M, where N represents the number of presses of A-button
        // and M is the number of presses for B-button
        // so you know that, if the prize is winnable, then the X movements of each times the number of presses of each = the prize's X value
        // and same is true for Y for the Y values
        // so from the example, you have: 94*N + 22*M = 8400 && 34*N + 67*M = 5400
        let [aValueX, aValueY] = machine[0];
        let [bValueX, bValueY] = machine[1];
        let [prizeX, prizeY] = machine[2];
        // (-bValueX * aValueY)M + (bValueY * aValueX)M = (prizeY*aValueX) - (prizeX*aValueY)
        // M = ((prizeY*aValueX) - (prizeX*aValueY)) / ((-bValueX * aValueY) + (bValueY * aValueX))

        let bButtonDivisor = ((-bValueX * aValueY) + (bValueY * aValueX));
        if (bButtonDivisor === 0) {
            // can't do that
            return 0;
        }

        let bButtonPresses = ((prizeY*aValueX) - (prizeX*aValueY)) / bButtonDivisor;
        // 94*N + 22*M = 8400
        // (aValueX)N + bValueX*bButtonPresses = prizeX
        // aButtonPresses = (prizeX - (bValueX*bButtonPresses)) / aValueX
        let aButtonPresses = (prizeX - (bValueX*bButtonPresses)) / aValueX;

        // I guess we can't finesse a non-integer press
        if (!Number.isInteger(aButtonPresses) || !Number.isInteger(bButtonPresses)) {
            return 0;
        }

        return aButtonPresses * 3 + bButtonPresses;
    };

    let findFewestTokensToWinPrizes = rawInput => {
        let machines = rawInput.split(/\n\n/).filter(el => el).map(machine => {
            return machine.split(/\n/).filter(el => el).map(row => row.match(/\d+/g).map(n => parseInt(n, 10)));
        });

        return machines.map(m => getTokensToWin(m)).reduce((a, e) => a + e, 0);
    };

    return [findFewestTokensToWinPrizes, findFewestTokensABitFurtherOut];
})();
