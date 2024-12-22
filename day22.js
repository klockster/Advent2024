var day22 = (() => {
    let findMostBananas = rawInput => {
        let startingNumbers = rawInput.split(/\n/).filter(el => el).map(n => parseInt(n, 10));

        let sequencesToTotalBananas = {};
        startingNumbers.forEach(n => {
            console.log(n);
            let secretNumber = n;
            let bananaNumbers = [n % 10];
            let seenKeys = {};
            for (let i = 0; i < 2000; i++) {
                secretNumber = calculateNextSecretNumber(secretNumber);
                bananaNumbers.push(secretNumber % 10);
                if (bananaNumbers.length >= 5) {
                    let changesSequences = bananaNumbers.slice(-5).reduce((a, e, i, arr) => i === 0 ? a : [...a, e - arr[i - 1]], []);
                    let changesKey = changesSequences.join(',');
                    if (seenKeys[changesKey]) {
                        continue;
                    }

                    seenKeys[changesKey] = true;
                    sequencesToTotalBananas[changesKey] = (sequencesToTotalBananas[changesKey] || 0)
                        + bananaNumbers[bananaNumbers.length - 1];
                }
            }
        });

        let bestSequenceNumber = -1;
        let bestSequence = null;
        Object.keys(sequencesToTotalBananas).forEach(key => {
            let bananas = sequencesToTotalBananas[key];
            if (bananas > bestSequenceNumber) {
                bestSequenceNumber = bananas;
                bestSequence = key;
            }
        });

        return bestSequenceNumber
    };

    // what a pain: JavaScript converts numbers to 32 bits before doing bitwise operators
    // so once the numbers get high enough the answer ends up negative
    let myXOR = (a, b) => {
        let binA = a.toString(2);
        let binB = b.toString(2);

        binA = binA.padStart(binB.length, '0');
        binB = binB.padStart(binA.length, '0');

        let result = '';
        for (let i = 0; i < binA.length; i++) {
            let concat = binA[i] + binB[i];
            if (concat === '01' || concat === '10') {
                result = result + '1';
                continue;
            }

            result = result + '0';
        }

        return parseInt(result, 2);
    };

    let calculateNextSecretNumber = secretNumber => {
        let modDivisor = 16777216;
        secretNumber = myXOR(secretNumber, (secretNumber * 64)) % modDivisor;
        secretNumber = myXOR(secretNumber, Math.floor(secretNumber / 32)) % modDivisor;
        secretNumber = myXOR(secretNumber, (secretNumber * 2048)) % modDivisor;
        return secretNumber;
    };

    let sum2000thSecretNumbers = rawInput => {
        let startingNumbers = rawInput.split(/\n/).filter(el => el).map(n => parseInt(n, 10));

        return startingNumbers.map(n => {
            console.log(n);
            let secretNumber = n;
            for (let i = 0; i < 2000; i++) {
                secretNumber = calculateNextSecretNumber(secretNumber);
            }

            return secretNumber;
        }).reduce((a, e) => a + e, 0);
    };

    return [sum2000thSecretNumbers, findMostBananas];
})();
