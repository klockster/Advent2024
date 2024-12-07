var day10 = (() => {
    let getNextPossibleSquares = (grid, rowIndex, colIndex) => {
        let currentValue = grid[rowIndex][colIndex];
        return [[rowIndex - 1, colIndex], [rowIndex + 1, colIndex], [rowIndex, colIndex - 1], [rowIndex, colIndex + 1]]
            .filter(pos => {
                let [r, c] = pos;
                return grid[r] && grid[r][c] && grid[r][c] - currentValue === 1
            });

    };

    let sumTrailheadRatings = rawInput => {
        let grid = rawInput.split(/\n/).filter(el => el).map(row => row.split('').map(n => parseInt(n)));

        let trailHeadScores = [];
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell !== 0) {
                    return;
                }

                let result = 0;

                let queue = [[rowIndex, colIndex]];
                while (queue.length) {
                    let currentPosition = queue.shift();
                    let nextPositions = getNextPossibleSquares(grid, ...currentPosition);

                    nextPositions.forEach(pos => {
                        let [r, c] = pos;
                        if (grid[r][c] === 9) {
                            result++;
                            return;
                        }

                        queue.push(pos);
                    });
                }

                trailHeadScores.push(result);
            });
        });

        return trailHeadScores.reduce((a, e) => a + e, 0);
    };

    let sumTrailheadScores = rawInput => {
        let grid = rawInput.split(/\n/).filter(el => el).map(row => row.split('').map(n => parseInt(n)));

        let trailHeadScores = [];
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell !== 0) {
                    return;
                }

                let ninePositions = {};

                let queue = [[rowIndex, colIndex]];
                while (queue.length) {
                    let currentPosition = queue.shift();
                    let nextPositions = getNextPossibleSquares(grid, ...currentPosition);

                    nextPositions.forEach(pos => {
                        let [r, c] = pos;
                        if (grid[r][c] === 9) {
                            ninePositions[pos.join(',')] = true;
                            return;
                        }

                        queue.push(pos);
                    });
                }

                trailHeadScores.push(Object.keys(ninePositions).length);
            });
        });

        return trailHeadScores.reduce((a, e) => a + e, 0);
    };

    return [sumTrailheadScores, sumTrailheadRatings];
})();
