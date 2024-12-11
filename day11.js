var day11 = (() => {
    let getStonesAfterBlinks = (stones, blinks = 25) => {
        for (let i = 0; i < blinks; i++) {
            let newStones = [];

            stones.forEach(stone => {
                if (stone === 0) {
                    newStones.push(1);
                    return;
                }

                let stoneStr = `${stone}`;
                if (stoneStr.length % 2 === 0) {
                    let midpoint = stoneStr.length / 2;
                    newStones.push(parseInt(stoneStr.slice(0, midpoint), 10));
                    newStones.push(parseInt(stoneStr.slice(midpoint), 10));
                    return;
                }

                newStones.push(stone * 2024);
            });

            stones = newStones;
        }

        return stones;
    }

    let countStonesAfterEvenMoreBlinks = rawInput => {
        let stones = rawInput.split(/\s+/).filter(el => el).map(n => parseInt(n));

        // position in the stone array doesn't actually matter, and the numbers like to repeat,
        // so let's group into a hash, where stone value is the key, and the number of stones with that value is the value
        let stoneCountsByStoneValue = {};
        stones.forEach(stone => {
            stoneCountsByStoneValue[stone] = (stoneCountsByStoneValue[stone] || 0) + 1;
        });

        let iterations = 75;
        for (let i = 0; i < iterations; i++) {
            let nextStoneCountsByStoneValue = {};

            Object.keys(stoneCountsByStoneValue).forEach(stone => {
                let count = stoneCountsByStoneValue[stone];
                stone = parseInt(stone, 10);

                if (stone === 0) {
                    nextStoneCountsByStoneValue[1] = (nextStoneCountsByStoneValue[1] || 0) + count;
                    return;
                }

                let stoneStr = `${stone}`;
                if (stoneStr.length % 2 === 0) {
                    let midpoint = stoneStr.length / 2;
                    let firstHalf = parseInt(stoneStr.slice(0, midpoint), 10);
                    let secondHalf = parseInt(stoneStr.slice(midpoint), 10);

                    nextStoneCountsByStoneValue[firstHalf] = (nextStoneCountsByStoneValue[firstHalf] || 0) + count;
                    nextStoneCountsByStoneValue[secondHalf] = (nextStoneCountsByStoneValue[secondHalf] || 0) + count;
                    return;
                }

                let nextStone = stone * 2024;
                nextStoneCountsByStoneValue[nextStone] = (nextStoneCountsByStoneValue[nextStone] || 0) + count;
            });

            stoneCountsByStoneValue = nextStoneCountsByStoneValue;
        }

        return Object.values(stoneCountsByStoneValue).reduce((a, e) => a + e, 0);
    };

    let countStonesAfterBlinks = rawInput => {
        let stones = rawInput.split(/\s+/).filter(el => el).map(n => parseInt(n));
        return getStonesAfterBlinks(stones).length;
    };

    return [countStonesAfterBlinks, countStonesAfterEvenMoreBlinks];
})();
