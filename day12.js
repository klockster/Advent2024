var day12 = (() => {
    let getSurroundingValues = (grid, rowIndex, colIndex) => {
        return [[rowIndex - 1, colIndex], [rowIndex + 1, colIndex], [rowIndex, colIndex - 1], [rowIndex, colIndex + 1]]
            .map(([r, c]) => grid[r] && grid[r][c]);
    };

    let getSurroundingPositions = (grid, rowIndex, colIndex) => {
        return [[rowIndex - 1, colIndex], [rowIndex + 1, colIndex], [rowIndex, colIndex - 1], [rowIndex, colIndex + 1]];
    }

    let addPositions = (posA, posB) => [posA[0] + posB[0], posA[1] + posB[1]];

    let findContiguousRegion = (grid, rowIndex, colIndex) => {
        let result = {};

        let queue = [[rowIndex, colIndex]];
        while (queue.length) {
            let current = queue.shift();
            let key = current.join(',');
            if (result[key]) {
                continue;
            }

            result[key] = true;
            let nextCandidates = getSurroundingPositions(grid, ...current)
                .filter(pos => {
                    let [r, c] = pos;
                    return grid[r] && grid[r][c] === grid[rowIndex][colIndex];
                });

            queue.push(...nextCandidates);
        }

        return Object.keys(result).map(key => key.split(',').map(n => parseInt(n)));
    };

    let sumDiscountFencePricesForAllGardenRegions = rawInput => {
        let grid = rawInput.split(/\n/).filter(el => el).map(row => row.split(''));

        let visitedPositions = {};

        let regionPrices = [];

        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                let position = [rowIndex, colIndex];
                let key = position.join(',');
                if (visitedPositions[key]) {
                    return;
                }

                visitedPositions[key] = true;
                let contiguousRegion = findContiguousRegion(grid, ...position);
                let area = contiguousRegion.length;

                let perimeter = 0;
                // okay, so this gets a bit more complicated...
                // if a region-included && adjacent && already-visited square has a fence in the same direction you do, don't double count
                contiguousRegion.forEach(pos => {
                    visitedPositions[pos.join(',')] = true;

                    let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                    // orthogonalsMap is indexed by the absolute value of the `directions` first index
                    // so if directions[1] = [1, 0], then we're moving down (adding to rows)
                    // so the first index of [1, 0] is 1, the absolute value of 1 is 1, and so the orthogonals are orthogonalsMap[1]
                    let orthogonalsMap = [
                        [[-1, 0], [1, 0]],
                        [[0, -1], [0, 1]],
                    ];
                    directions.forEach(dir => {
                        let [r, c] = addPositions(pos, dir);
                        if ((grid[r] && grid[r][c]) === cell) {
                            return;
                        }

                        let orthogonals = orthogonalsMap[Math.abs(dir[0])];
                        // now we check if any orthogonal position has a fence in the same direction,
                        // which is indicated by having been visited and having a valid fence there
                        let previousFenceInDirection = orthogonals.find(orthogonalDirection => {
                            let orthogonalPosition = addPositions(pos, orthogonalDirection);
                            // if we haven't visited there before, then we can't have laid fence there already
                            if (!visitedPositions[orthogonalPosition.join(',')]) {
                                return false;
                            }

                            let orthogonalPositionValue = grid[orthogonalPosition[0]] && grid[orthogonalPosition[0]][orthogonalPosition[1]];
                            // if it's not part of the same region, it doesn't have any fencing that we care about:
                            if (orthogonalPositionValue !== cell) {
                                return false;
                            }

                            // check the same side of the orthogonal position to see if we've laid fence already
                            let sameDirectionAdjacentToOrthogonal = addPositions(orthogonalPosition, dir);
                            let [ri, ci] = sameDirectionAdjacentToOrthogonal;
                            return (grid[ri] && grid[ri][ci]) !== cell;
                        });

                        if (!previousFenceInDirection) {
                            perimeter++;
                        }
                    });
                });

                regionPrices.push(area * perimeter);
            });
        });

        return regionPrices.reduce((a, e) => a + e, 0);
    };

    let sumFencePricesForAllGardenRegions = rawInput => {
        let grid = rawInput.split(/\n/).filter(el => el).map(row => row.split(''));

        let visitedPositions = {};

        let regionPrices = [];

        // so, finding all the areas just means finding contiguous regions and then counting
        // finding the perimeter you just get the surrounding squares and count ones that don't match the region you're in
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                let position = [rowIndex, colIndex];
                let key = position.join(',');
                if (visitedPositions[key]) {
                    return;
                }

                visitedPositions[key] = true;
                let contiguousRegion = findContiguousRegion(grid, ...position);
                let area = contiguousRegion.length;

                let perimeter = 0;
                contiguousRegion.forEach(pos => {
                    perimeter += getSurroundingValues(grid, ...pos).filter(val => val !== cell).length;
                    visitedPositions[pos.join(',')] = true;
                });

                regionPrices.push(area * perimeter);
            });
        });

        return regionPrices.reduce((a, e) => a + e, 0);
    };

    return [sumFencePricesForAllGardenRegions, sumDiscountFencePricesForAllGardenRegions];
})();
