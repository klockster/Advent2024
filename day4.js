var day4 = (() => {
    let arrayColumn = (arr, colIndex) => arr.map(row => row[colIndex]);

    let getDiagonalCells = (grid, rowIndex, colIndex) => {
        return [[-1, -1], [-1, 1], [1, -1], [1, 1]].map(dir => {
            let [rowIncrement, colIncrement] = dir;
            let [r, c] = [rowIndex + rowIncrement, colIndex + colIncrement];
            return grid[r] && grid[r][c];
        });
    };

    let getXShapedMasCount = rawInput => {
        let grid = rawInput.split(/\n/).filter(el => el).map(row => row.split('').filter(el => el));
        let result = 0;

        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell !== 'A') {
                    return;
                }

                let diagonals = getDiagonalCells(grid, rowIndex, colIndex);
                if (
                    [diagonals[0], diagonals[3]].sort().join('') === 'MS' &&
                    [diagonals[1], diagonals[2]].sort().join('') === 'MS'
                ) {
                    result++;
                }
            });
        });
        return result;
    };

    // in order to not examine the same coords twice, we don't go "backward" for rows, or "upward" for cols/diagonals
    let getDirectionalArraysAfterCoord = (grid, rowIndex, colIndex, length = 4) => {
        let result = [];
        let row = grid[rowIndex];
        result.push(row.slice(colIndex, colIndex + length));

        let column = arrayColumn(grid, colIndex);
        result.push(column.slice(rowIndex, rowIndex + length));

        result.push(...[[-1, 1], [1, 1]].map(dir => {
            let diagonal = [grid[rowIndex][colIndex]];
            let [rowIncrement, colIncrement] = dir;
            let [r, c] = [rowIndex, colIndex];
            for (let i = 0; i < length - 1; i++) {
                r = r + rowIncrement;
                c = c + colIncrement;
                if (!grid[r] || !grid[r][c]) {
                    return diagonal;
                }

                diagonal.push(grid[r][c]);
            }

            return diagonal;
        }));

        return result;
    };

    let getXmasCount = rawInput => {
        let grid = rawInput.split(/\n/).filter(el => el).map(row => row.split('').filter(el => el));
        let result = 0;
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                let slices = getDirectionalArraysAfterCoord(grid, rowIndex, colIndex);
                result += slices.filter(slice => {
                    return slice.join('') === 'XMAS' || slice.reverse().join('') === 'XMAS';
                }).length;
            });
        });
        return result;
    };

    return [getXmasCount, getXShapedMasCount];
})();
