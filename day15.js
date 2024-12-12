var day15 = (() => {
    let sumGPSCoordinatesInBigWarehouse = rawInput => {
        let [smallGrid, moves] = rawInput.split(/\n\n/).filter(el => el).map((el, i) => {
            if (i == 0) {
                return el.split(/\n/).filter(el => el).map(row => row.split(''));
            }

            return el.split('').filter(c => c !== "\n");
        });

        let grid = [];
        let substitutions = {
            '#': ['#', '#'],
            'O': ['[', ']'],
            '.': ['.', '.'],
            '@': ['@', '.'],
        };
        for (let rowIndex = 0; rowIndex < smallGrid.length; rowIndex++) {
            let row = [];
            for (let colIndex = 0; colIndex < smallGrid[rowIndex].length; colIndex++) {
                let value = smallGrid[rowIndex][colIndex];
                let sub = substitutions[value];
                assert(sub, 'Must map to a valid substitution');
                row.push(...sub);
            }
            grid.push(row);
        }

        let currentRobotPosition = getStartingRobotPosition(grid);
        let movesToDirections = {
            '^': [-1, 0],
            '<': [0, -1],
            '>': [0, 1],
            'v': [1, 0],
        };
        moves.forEach((move, moveIndex) => {
            let direction = movesToDirections[move];
            assert(direction, 'Moves need to map properly');

            // ok, now we have a sort of "expanding wavefront of moves"
            let multipleMovableSlices = getMultipleMovableSlices(grid, currentRobotPosition, direction);
            multipleMovableSlices.forEach(movableSlicePositions => {
                movableSlicePositions.forEach((pos, i) => {
                    let [startingRowIndex, startingColIndex] = pos;
                    let movingValue = grid[startingRowIndex][startingColIndex];
                    let [targetRowIndex, targetColIndex] = addPositions(pos, direction);
                    grid[targetRowIndex][targetColIndex] = movingValue;
                    if (
                        i === movableSlicePositions.length - 1 ||
                        // when we're considering slices that move along rows (index-0 of a position)
                        // then there may be gaps > 1 between those to-be-updated-positions. If we see a gap > 1
                        // between those elements, we need to update the position we just moved from since we know it
                        // cannot be in the slice
                        (Math.abs(movableSlicePositions[i][0] - movableSlicePositions[i + 1][0]) > 1)
                    ) {
                        grid[startingRowIndex][startingColIndex] = '.';
                    }
                });
            });

            if (multipleMovableSlices.filter(slice => slice.length).length) {
                currentRobotPosition = addPositions(currentRobotPosition, direction);
            }
        });

        let result = 0;
        grid.forEach((row, rowIndex) => row.forEach((cell, colIndex) => {
            if (cell === '[') {
                result += 100 * rowIndex + colIndex;
            }
        }));
        return result;
    };

    let getMultipleMovableSlices = (grid, robotPosition, direction) => {
        if (direction[0] === 0) {
            // moving left/right is just a single slice
            return [getMovableSlice(grid, robotPosition, direction)];
        }

        let resultsByColumn = {};
        let activeColumns = {
            [robotPosition[1]]: true,
        };
        let lines = [[robotPosition]];
        while (lines.length) {
            let line = lines.shift();
            let currentPosition = line[0];
            let checkPosition = addPositions(currentPosition, direction);
            let [r, c] = checkPosition;
            let value = grid[r][c];

            if (value === '#') {
                return [];
            }

            if (value === '.') {
                resultsByColumn[c] = line;
                activeColumns[c] = false;
                continue;
            }

            let otherHalfOfBoxPosition;
            let isFurther = (a, b) => {
                if (direction[0] === 1) {
                    return a > b;
                }
                return b > a;
            };

            if (value === '[' || value === ']') {
                lines.push([checkPosition, ...line]);
                let columnShift = value === '[' ? 1 : -1;
                otherHalfOfBoxPosition = addPositions(checkPosition, [0, columnShift]);
                // if we already have an active line in this column, no need to dupe our efforts:
                if (!activeColumns[otherHalfOfBoxPosition[1]]) {
                    // if we haven't seen anything in this column, then we'll account for the box spilling over into this column
                    if (!resultsByColumn[otherHalfOfBoxPosition[1]]) {
                        lines.push([otherHalfOfBoxPosition]);
                        activeColumns[otherHalfOfBoxPosition[1]] = true;
                        continue;
                    }

                    // this part is a pain: essentially we thought we were done pushing stuff in this column because
                    // we found a '.', but now the boxes may have leaked back into this column.  If so we have to pull the
                    // old line and reactivate it once more
                    if (isFurther(r, resultsByColumn[otherHalfOfBoxPosition[1]][0][0] + direction[0])) {
                        let reactivatedLine = resultsByColumn[otherHalfOfBoxPosition[1]];
                        delete resultsByColumn[otherHalfOfBoxPosition[1]];
                        activeColumns[otherHalfOfBoxPosition[1]] = true;
                        lines.push([otherHalfOfBoxPosition, ...reactivatedLine]);
                    }
                }

                continue;
            }

            assert(false, `Unexpected value ${value}`);
        }

        return Object.values(resultsByColumn);
    };

    let getStartingRobotPosition = grid => {
        for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
            for (let colIndex = 0; colIndex < grid[rowIndex].length; colIndex++) {
                if (grid[rowIndex][colIndex] === '@') {
                    return [rowIndex, colIndex];
                }
            }
        }

        assert(false, 'could not find the robot');
    };

    let addPositions = (posA, posB) => [posA[0] + posB[0], posA[1] + posB[1]];

    let getMovableSlice = (grid, robotPosition, moveDirection) => {
        let canMove = false;
        let checkPosition = addPositions(robotPosition, moveDirection);
        let movableSlicePositions = [robotPosition];

        while (true) {
            let [r, c] = checkPosition;
            let value = grid[r][c];
            if (value === '#') {
                break;
            }

            if (value === '.') {
                canMove = true;
                break;
            }

            // unshift instead of push, because we should be able to iterate + update them in order
            movableSlicePositions.unshift([r, c]);
            checkPosition = addPositions(checkPosition, moveDirection);
        }

        return canMove ? movableSlicePositions : [];
    };

    let sumGPSCoordinatesAfterBoxPushing = rawInput => {
        let [grid, moves] = rawInput.split(/\n\n/).filter(el => el).map((el, i) => {
            if (i == 0) {
                return el.split(/\n/).filter(el => el).map(row => row.split(''));
            }

            return el.split('').filter(c => c !== "\n");
        });

        let currentRobotPosition = getStartingRobotPosition(grid);
        let movesToDirections = {
            '^': [-1, 0],
            '<': [0, -1],
            '>': [0, 1],
            'v': [1, 0],
        };
        moves.forEach(move => {
            let direction = movesToDirections[move];
            assert(direction, 'Moves need to map properly');

            let movableSlicePositions = getMovableSlice(grid, currentRobotPosition, direction);
            movableSlicePositions.forEach(pos => {
                let [startingRowIndex, startingColIndex] = pos;
                let movingValue = grid[startingRowIndex][startingColIndex];
                let [targetRowIndex, targetColIndex] = addPositions(pos, direction);
                grid[targetRowIndex][targetColIndex] = movingValue;
            });

            if (movableSlicePositions.length) {
                let [oldRobotRowIndex, oldRobotColIndex] = currentRobotPosition;
                currentRobotPosition = addPositions(currentRobotPosition, direction);
                grid[oldRobotRowIndex][oldRobotColIndex] = '.';
            }
        });

        let result = 0;
        grid.forEach((row, rowIndex) => row.forEach((cell, colIndex) => {
            if (cell === 'O') {
                result += 100 * rowIndex + colIndex;
            }
        }));
        return result;
    };

    return [sumGPSCoordinatesAfterBoxPushing, sumGPSCoordinatesInBigWarehouse];
})();
