var day16 = (() => {
    // unfortunately, as it stands, this takes about 2-3 mins to complete with the input I was given
    let findUniqueTilesOnBestReindeerPaths = rawInput => {
        // most of this is copypasta from part 1
        let grid = rawInput.split(/\n/).filter(el => el).map(row => row.split(''));

        let lowestScore = findLowestReindeerMazeScore(rawInput);

        let lowestByTiles = {};

        let bestPathsVisitedTiles = {};

        let queue = [{ score: 0, visitedTiles: {}, currentPosition: findStartRowColIndex(grid), currentDirection: [0, 1]}];
        let iterations = 0;
        while (queue.length) {
            let {score, visitedTiles, currentPosition, currentDirection} = queue.shift();
            iterations++;
            if (iterations % 10000 === 0) {
                console.log(queue.length, lowestScore, score);
            }

            // if it's higher than the (set) lowestScore, cull it
            if (score > lowestScore) {
                continue;
            }

            let [rowIndex, colIndex] = currentPosition;
            let positionKey = currentPosition.join(',');
            visitedTiles[positionKey] = true;

            if (grid[rowIndex][colIndex] === 'E') {
                // if the scores are the same, add to the bestPathsVisitedTiles
                if (lowestScore === score) {
                    Object.keys(visitedTiles).forEach(key => bestPathsVisitedTiles[key] = true);
                    continue;
                }

                assert(false, 'We already got the lowestScore you cannot go lower');
                continue;
            }

            // the issue is that the score coming onto a tile and the score coming off of a tile are not the same
            // you can enter a tile with a high score, but then leaving it you can match the score of that other path
            // so my workaround is to check if there's a turn-off and, if so, don't cull this based on lowestByTiles
            let hasTurn = getOrthogonalDirections(currentDirection).find(dir => {
                let [r, c] = addPositions(currentPosition, dir);
                return grid[r] && grid[r][c] && grid[r][c] !== '#';
            })
            if (lowestByTiles[positionKey] !== undefined && !hasTurn && lowestByTiles[positionKey] < score) {
                continue;
            }
            lowestByTiles[positionKey] = score;

            let nextPosition = addPositions(currentPosition, currentDirection);
            let nextPositionKey = nextPosition.join(',');
            if (isMovableTile(grid, nextPosition)) {
                queue.push({ score: score + 1, visitedTiles: {...visitedTiles}, currentPosition: nextPosition, currentDirection });
            }

            nextPosition = addPositions(currentPosition, getOppositeDirection(currentDirection));
            nextPositionKey = nextPosition.join(',');
            if (isMovableTile(grid, nextPosition)) {
                queue.push({
                    score: score + 2001,
                    visitedTiles: {...visitedTiles},
                    currentPosition: nextPosition,
                    currentDirection: getOppositeDirection(currentDirection)
                });
            }

            getOrthogonalDirections(currentDirection).forEach(dir => {
                nextPosition = addPositions(currentPosition, dir);
                nextPositionKey = nextPosition.join(',');
                if (isMovableTile(grid, nextPosition)) {
                    queue.push({
                        score: score + 1001,
                        visitedTiles: {...visitedTiles},
                        currentPosition: nextPosition,
                        currentDirection: dir
                    });
                }
            });
        }

        return Object.keys(bestPathsVisitedTiles).length;
    };

    let findStartRowColIndex = grid => {
        for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
            for (let colIndex = 0; colIndex < grid[0].length; colIndex++) {
                if (grid[rowIndex][colIndex] === 'S') {
                    return [rowIndex, colIndex];
                }
            }
        }
        assert(false, 'No start tile???');
    };

    let addPositions = (posA, posB) => [posA[0] + posB[0], posA[1] + posB[1]];

    let getValidMovesFromCurrentPosition = (grid, currentPosition) => {
        return [[1, 0], [-1, 0], [0, 1], [0, -1]].map(dir => addPositions(currentPosition, dir))
            .filter(pos => {
                let [r, c] = pos;
                return grid[r] && grid[r][c] && grid[r][c] !== '#';
            });
    };

    let subtractPositions = (posA, posB) => [posA[0] - posB[0], posA[1] - posB[1]];

    let getOppositeDirection = dir => dir.map(n => n * -1);

    let getOrthogonalDirections = dir => [1, -1].map(f => [...dir].reverse().map(n => n* f));

    let isMovableTile = (grid, position) => grid[position[0]] && grid[position[0]][position[1]] && grid[position[0]][position[1]] !== '#';

    let findLowestReindeerMazeScore = rawInput => {
        let grid = rawInput.split(/\n/).filter(el => el).map(row => row.split(''));

        let lowestScore = undefined;

        let lowestByTiles = {};

        let queue = [{ score: 0, currentPosition: findStartRowColIndex(grid), currentDirection: [0, 1]}];
        while (queue.length) {
            let {score, currentPosition, currentDirection} = queue.shift();

            // if it's higher than the (set) lowestScore, cull it
            if (lowestScore !== undefined && score > lowestScore) {
                continue;
            }

            let [rowIndex, colIndex] = currentPosition;
            if (grid[rowIndex][colIndex] === 'E') {
                lowestScore = score;
                continue;
            }

            let positionKey = currentPosition.join(',');

            if (lowestByTiles[positionKey] !== undefined && lowestByTiles[positionKey] < score) {
                continue;
            }
            lowestByTiles[positionKey] = score;

            let nextPosition = addPositions(currentPosition, currentDirection);
            let nextPositionKey = nextPosition.join(',');
            if (isMovableTile(grid, nextPosition)) {
                queue.push({ score: score + 1, currentPosition: nextPosition, currentDirection });
            }

            nextPosition = addPositions(currentPosition, getOppositeDirection(currentDirection));
            nextPositionKey = nextPosition.join(',');
            if (isMovableTile(grid, nextPosition)) {
                queue.push({
                    score: score + 2001,
                    currentPosition: nextPosition,
                    currentDirection: getOppositeDirection(currentDirection)
                });
            }

            getOrthogonalDirections(currentDirection).forEach(dir => {
                nextPosition = addPositions(currentPosition, dir);
                nextPositionKey = nextPosition.join(',');
                if (isMovableTile(grid, nextPosition)) {
                    queue.push({
                        score: score + 1001,
                        currentPosition: nextPosition,
                        currentDirection: dir
                    });
                }
            });
        }

        return lowestScore;
    };

    return [findLowestReindeerMazeScore, findUniqueTilesOnBestReindeerPaths];
})();
