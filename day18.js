var day18 = (() => {
    let findFirstCoordinateThatBlocksExit = rawInput => {
        let bytes = rawInput.split(/\n/).filter(el => el)
            .map(row => row.match(/\d+/g).map(n => parseInt(n, 10)));

        // let gridMaxCoord = 6;
        let gridMaxCoord = 70;
        let grid = [];
        for (let i = 0; i <= gridMaxCoord; i++) {
            let row = [];
            for (j = 0; j <= gridMaxCoord; j++) {
                row.push('.');
            }
            grid.push(row);
        }

        let byteIndex = 1024;
        // let byteIndex = 12;
        bytes.slice(0, byteIndex).forEach(([x, y]) => {
            // y is coordinate that crosses rows, and x is the coordinate that crosses columns
            assert(grid[y] && grid[y][x], `These positions should be on the grid but x: ${x}, y: ${y} is not`);
            grid[y][x] = '#';
        });

        while (findFewestStepsToExit(grid) !== -1) {
            let [x, y] = bytes[byteIndex];
            byteIndex++;
            assert(grid[y] && grid[y][x], `These positions should be on the grid but x: ${x}, y: ${y} is not`);
            grid[y][x] = '#';
        }

        // minus 1 because I do the ++ in the while loop before reassigning the next [x,y] to the bytes[byteIndex]
        return bytes[byteIndex - 1];
    };

    let getValidSurroundingPositions = (grid, currentPosition) => {
        let [rowIndex, colIndex] = currentPosition;
        return [[rowIndex + 1, colIndex], [rowIndex - 1, colIndex], [rowIndex, colIndex + 1], [rowIndex, colIndex - 1]]
            .filter(pos => {
                let [r, c] = pos;
                return grid[r] && grid[r][c] && grid[r][c] !== '#';
            });
    };

    let findFewestStepsToExit = (grid) => {
        let gridMaxCoord = grid.length - 1;
        let queue = [{ currentPosition: [0, 0], steps: 0 }];
        let visitedPositions = {};
        let finalPositionKey = [gridMaxCoord, gridMaxCoord].join(',');
        while (queue.length) {
            let { currentPosition, steps } = queue.shift();
            let positionKey = currentPosition.join(',');

            if (positionKey === finalPositionKey) {
                return steps;
            }

            if (visitedPositions[positionKey]) {
                continue;
            }
            visitedPositions[positionKey] = true;

            let nextPositions = getValidSurroundingPositions(grid, currentPosition);
            nextPositions.forEach(pos => {
                queue.push({ currentPosition: pos, steps: steps + 1 });
            });
        }

        return -1;
    };

    let part1 = rawInput => {
        let firstKilobyteOfBytes = rawInput.split(/\n/).filter(el => el)
            .map(row => row.match(/\d+/g).map(n => parseInt(n, 10))).slice(0, 1024);
            // .map(row => row.match(/\d+/g).map(n => parseInt(n, 10))).slice(0, 12);

        // let gridMaxCoord = 6;
        let gridMaxCoord = 70;
        let grid = [];
        for (let i = 0; i <= gridMaxCoord; i++) {
            let row = [];
            for (j = 0; j <= gridMaxCoord; j++) {
                row.push('.');
            }
            grid.push(row);
        }

        firstKilobyteOfBytes.forEach(([x, y]) => {
            // y is coordinate that crosses rows, and x is the coordinate that crosses columns
            assert(grid[y] && grid[y][x], `These positions should be on the grid but x: ${x}, y: ${y} is not`);
            grid[y][x] = '#';
        });

        return findFewestStepsToExit(grid);
    };

    return [part1, findFirstCoordinateThatBlocksExit];
})();
