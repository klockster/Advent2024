var day6 = (() => {
    let countUniqueLoopingObstacles = rawInput => {
        let grid = rawInput.split(/\n/).filter(el => el).map(row => row.split(''));
        let [guardRowIndex, guardColIndex] = getGuardStartPosition(grid);

        // first, let's populate the guard's unobstructed route
        let uniqueGuardPositions = {};
        let directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        let currentDirectionIndex = 0;
        while (grid[guardRowIndex] && grid[guardRowIndex][guardColIndex]) {
            let positionKey = [guardRowIndex, guardColIndex].join(',');
            uniqueGuardPositions[positionKey] = true;

            let possibleNextCell = addPositions([guardRowIndex, guardColIndex], directions[currentDirectionIndex]);
            let [r, c] = possibleNextCell;
            if (grid[r] && grid[r][c] === '#') {
                currentDirectionIndex = (currentDirectionIndex + 1) % directions.length;
                continue;
            }

            [guardRowIndex, guardColIndex] = possibleNextCell;
        }

        // back to the start
        let result = 0;
        Object.keys(uniqueGuardPositions).forEach(obstaclePositionKey => {
            [guardRowIndex, guardColIndex] = getGuardStartPosition(grid);
            let positionKey = [guardRowIndex, guardColIndex].join(',');
            if (obstaclePositionKey === positionKey) {
                // can't block the start position
                return;
            }

            let visitedPositions = {};
            currentDirectionIndex = 0;
            while (grid[guardRowIndex] && grid[guardRowIndex][guardColIndex]) {
                positionKey = [guardRowIndex, guardColIndex].join(',');
                if (visitedPositions[positionKey] && visitedPositions[positionKey][currentDirectionIndex]) {
                    // we've successfully created a loop, so let's tally and exit
                    result++;
                    return;
                }

                visitedPositions[positionKey] = visitedPositions[positionKey] || {};
                visitedPositions[positionKey][currentDirectionIndex] = true;

                let possibleNextCell = addPositions([guardRowIndex, guardColIndex], directions[currentDirectionIndex]);
                let [r, c] = possibleNextCell;
                if (
                    grid[r] && grid[r][c] === '#' ||
                    [r,c].join(',') === obstaclePositionKey
                ) {
                    currentDirectionIndex = (currentDirectionIndex + 1) % directions.length;
                    continue;
                }

                [guardRowIndex, guardColIndex] = possibleNextCell;
            }
        });

        return result;
    };

    let getGuardStartPosition = grid => {
        for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
            for (let colIndex = 0; colIndex < grid.length; colIndex++) {
                if (grid[rowIndex][colIndex] === '^') {
                    return [rowIndex, colIndex];
                }
            }
        }

        assert(false, 'Could not find guard start position');
    };

    let addPositions = (posA, posB) => [posA[0] + posB[0], posA[1] + posB[1]];

    let countUniqueGuardPositions = rawInput => {
        let grid = rawInput.split(/\n/).filter(el => el).map(row => row.split(''));
        let [guardRowIndex, guardColIndex] = getGuardStartPosition(grid);

        let uniqueGuardPositions = {};
        let directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        let currentDirectionIndex = 0;
        while (grid[guardRowIndex] && grid[guardRowIndex][guardColIndex]) {
            let positionKey = [guardRowIndex, guardColIndex].join(',');
            uniqueGuardPositions[positionKey] = true;

            let possibleNextCell = addPositions([guardRowIndex, guardColIndex], directions[currentDirectionIndex]);
            let [r, c] = possibleNextCell;
            if (grid[r] && grid[r][c] === '#') {
                currentDirectionIndex = (currentDirectionIndex + 1) % directions.length;
                continue;
            }

            [guardRowIndex, guardColIndex] = possibleNextCell;
        }

        return Object.keys(uniqueGuardPositions).length;
    };

    return [countUniqueGuardPositions, countUniqueLoopingObstacles];
})();
