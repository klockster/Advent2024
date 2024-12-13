var day20 = (() => {
    let getDistanceBetweenPositions = (posA, posB) => Math.abs(posA[0] - posB[0]) + Math.abs(posA[1] - posB[1]);

    let countSuperCheatsThroughRaceTrack = rawInput => {
        let grid = rawInput.split(/\n/).filter(el => el).map(str => str.split(''));
        let [startRowIndex, startColIndex] = findPosition(grid, 'S');
        let [endRowIndex, endColIndex] = findPosition(grid, 'S');

        // first, let's turn every S/./E position into a "distance from the end without cheating"
        // then, we basically want to go from each position we're on and see "give me the list of positions i can reach, via cheating"
        // whose difference in stepsFromPositionToEndWithoutCheating is >= 100

        let stepsWithoutCheating = 0;
        let queue = [{steps: 0, currentPosition: [startRowIndex, startColIndex], path: [[startRowIndex, startColIndex]]}];
        let visitedPositions = {};
        let victoryPath = null;
        while (queue.length) {
            let { steps, currentPosition, path } = queue.shift();
            let [rowIndex, colIndex] = currentPosition;
            if (grid[rowIndex][colIndex] === 'E') {
                stepsWithoutCheating = steps;
                victoryPath = path;
                break;
            }

            let currentPositionKey = currentPosition.join(',');
            if (visitedPositions[currentPositionKey]) {
                continue;
            }
            visitedPositions[currentPositionKey] = true;

            getValidNextPositions(grid, currentPosition).forEach(pos => {
                queue.push({ steps: steps + 1, currentPosition: pos, path: [pos, ...path] });
            });
        }

        let stepsFromPositionToEndWithoutCheating = {};
        victoryPath.forEach((pos, i) => {
            let key = pos.join(',');
            stepsFromPositionToEndWithoutCheating[key] = i;
        });

        let gridDotsCount = grid.reduce((a, row) => a + row.filter(el => el === '.').length, 0);
        // this below just happens to be true for my input, i'm not sure it's a guarantee
        // but if not you'd just have to find the remaining dots and run them through the loop above _as if_
        // they were the start position
        assert(Object.keys(stepsFromPositionToEndWithoutCheating).length === gridDotsCount + 2, 'We should have every position mapped');

        let savesToCounts = {};
        let result = 0;
        Object.keys(stepsFromPositionToEndWithoutCheating).forEach(posKey => {
            let stepsToEndFromStartPosition = stepsFromPositionToEndWithoutCheating[posKey];
            Object.keys(stepsFromPositionToEndWithoutCheating).forEach(jumpPosKey => {

                let [startPosition, endPosition] = [posKey, jumpPosKey].map(k => k.split(',').map(n => parseInt(n, 10)));
                let distance = getDistanceBetweenPositions(startPosition, endPosition);
                if (distance > 20) {
                    return;
                }

                let stepsSavedIfReachable = stepsToEndFromStartPosition - stepsFromPositionToEndWithoutCheating[jumpPosKey] - distance;
                // if (stepsSavedIfReachable >= 50) {
                if (stepsSavedIfReachable >= 100) {
                    // savesToCounts[stepsSavedIfReachable] = (savesToCounts[stepsSavedIfReachable] || 0) + 1;
                    result++;
                }
            });
        });

        return result;
        // return savesToCounts;
    };

    let findPosition = (grid, value) => {
        for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
            for (let colIndex = 0; colIndex < grid[rowIndex].length; colIndex++) {
                if (grid[rowIndex][colIndex] === value) {
                    return [rowIndex, colIndex];
                }
            }
        }

        assert(false, `Could not find value ${value} on given grid`);
    };

    let getValidNextPositions = (grid, currentPosition) => {
        let [rowIndex, colIndex] = currentPosition;
        return [[rowIndex + 1, colIndex], [rowIndex - 1, colIndex], [rowIndex, colIndex + 1], [rowIndex, colIndex - 1]]
            .filter(pos => {
                let [r, c] = pos;
                return grid[r] && grid[r][c] && grid[r][c] !== '#';
            });
    };

    let getCheatPositions = (grid, currentPosition) => {
        let [rowIndex, colIndex] = currentPosition;
        let currentPositionKey = currentPosition.join(',');
        let cheatPositionsMap = [[rowIndex + 1, colIndex], [rowIndex - 1, colIndex], [rowIndex, colIndex + 1], [rowIndex, colIndex - 1]]
            .filter(pos => {
                let [r, c] = pos;
                // to cheat, we have to step into a wall
                return grid[r] && grid[r][c] && grid[r][c] === '#';
            })
            .map(pos => getValidNextPositions(grid, pos))
            .flat()
            .reduce((a, e) => {
                let key = e.join(',');
                if (currentPositionKey === key) {
                    return a;
                }

                a[key] = true;
                return a;
            }, {});

        return Object.keys(cheatPositionsMap).map(k => k.split(',').map(n => parseInt(n)));
    };

    let countGoodCheatsThroughRacetrack = rawInput => {
        let grid = rawInput.split(/\n/).filter(el => el).map(str => str.split(''));
        let [startRowIndex, startColIndex] = findPosition(grid, 'S');
        let [endRowIndex, endColIndex] = findPosition(grid, 'S');

        let stepsWithoutCheating = 0;
        let queue = [{steps: 0, currentPosition: [startRowIndex, startColIndex], path: [[startRowIndex, startColIndex]]}];
        let visitedPositions = {};
        let victoryPath = null;
        while (queue.length) {
            let { steps, currentPosition, path } = queue.shift();
            let [rowIndex, colIndex] = currentPosition;
            if (grid[rowIndex][colIndex] === 'E') {
                stepsWithoutCheating = steps;
                victoryPath = path;
                break;
            }

            let currentPositionKey = currentPosition.join(',');
            if (visitedPositions[currentPositionKey]) {
                continue;
            }
            visitedPositions[currentPositionKey] = true;

            getValidNextPositions(grid, currentPosition).forEach(pos => {
                queue.push({ steps: steps + 1, currentPosition: pos, path: [pos, ...path] });
            });
        }

        let stepsFromPositionToEndWithoutCheating = {};
        victoryPath.forEach((pos, i) => {
            let key = pos.join(',');
            stepsFromPositionToEndWithoutCheating[key] = i;
        });

        console.log(Object.keys(stepsFromPositionToEndWithoutCheating).length, 'steps keys');

        queue = [
            {
                steps: 0,
                currentPosition: [startRowIndex, startColIndex],
                cheatPositions: undefined,
                visitedPositions: {},
                pathAfterCheat: [],
            }
        ];
        // cheat map is mapped by [...startPosition, ...endPosition].join(',') = stepsSaved;
        let cheatMap = {};
        while (queue.length) {
            let { steps, currentPosition, visitedPositions, cheatPositions, pathAfterCheat } = queue.shift();
            let [rowIndex, colIndex] = currentPosition;
            let cheatKey = cheatPositions ? cheatPositions.map(pos => pos.join(',')).join(',') : null;
            let currentPositionKey = currentPosition.join(',');

            if (cheatMap[cheatKey] !== undefined) {
                continue;
            }

            if (steps >= stepsWithoutCheating) {
                // this does not save time
                continue;
            }

            if (cheatKey && stepsFromPositionToEndWithoutCheating[currentPositionKey]) {
                let stepsToFinish = stepsFromPositionToEndWithoutCheating[currentPositionKey] + steps;
                let stepsSaved = stepsWithoutCheating - stepsToFinish;
                if (stepsSaved > 0) {
                    cheatMap[cheatKey] = stepsSaved;
                }
                pathAfterCheat.forEach((pos, i) => {
                    let key = pos.join(',');
                    stepsFromPositionToEndWithoutCheating[key] = i + stepsFromPositionToEndWithoutCheating[currentPositionKey];
                });
                continue;
            }

            if (grid[rowIndex][colIndex] === 'E') {
                if (!cheatPositions) {
                    continue;
                }

                cheatMap[cheatKey] = stepsWithoutCheating - steps;
                pathAfterCheat.forEach((pos, i) => {
                    let key = pos.join(',');
                    stepsFromPositionToEndWithoutCheating[key] = i;
                });
                continue;
            }

            if (visitedPositions[currentPositionKey]) {
                continue;
            }
            visitedPositions[currentPositionKey] = true;

            getValidNextPositions(grid, currentPosition).forEach(pos => {
                queue.push(
                    {
                        steps: steps + 1,
                        currentPosition: pos,
                        cheatPositions,
                        visitedPositions: {...visitedPositions},
                        pathAfterCheat: cheatKey ? [pos, ...pathAfterCheat] : pathAfterCheat,
                    }
                );
            });

            if (!cheatPositions) {
                getCheatPositions(grid, currentPosition).forEach(pos => {
                    queue.push({
                        steps: steps + 2,
                        currentPosition: pos,
                        cheatPositions: [currentPosition, pos],
                        visitedPositions: {...visitedPositions},
                        pathAfterCheat: [pos],
                    });
                });
            }
        }

        let savedTimeTally = {};
        Object.keys(cheatMap).forEach(k => {
            let v = cheatMap[k];
            savedTimeTally[v] = (savedTimeTally[v] || 0) + 1;
        });

        return Object.keys(savedTimeTally).filter(k => k >= 100).reduce((a, e) => a + savedTimeTally[e], 0);
    };

    return [countGoodCheatsThroughRacetrack, countSuperCheatsThroughRaceTrack];
})();
