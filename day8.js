var day8 = (() => {

    let addPositions = (posA, posB) => [posA[0] + posB[0], posA[1] + posB[1]];

    let getPositionDifference = (posA, posB) => [posA[0] - posB[0], posA[1] - posB[1]];

    let countTotalAntinodesWithResonantHarmonics = rawInput => {
        let grid = rawInput.split(/\n/).filter(el => el).map(row => row.split('').filter(el => el));

        // same as part 1, collect all the nodes that share a frequency
        let nodesByFrequency = {};
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell.match(/[a-zA-Z0-9]/)) {
                    nodesByFrequency[cell] = nodesByFrequency[cell] || [];
                    nodesByFrequency[cell].push([rowIndex, colIndex]);
                }
            });
        });

        let uniqueAntinodesByPositionKey = {};
        Object.values(nodesByFrequency).forEach(nodes => {
            for (let i = 0; i < nodes.length - 1; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    // both antennas are exactly in line with the other, I guess
                    uniqueAntinodesByPositionKey[nodes[i].join(',')] = true;
                    uniqueAntinodesByPositionKey[nodes[j].join(',')] = true;


                    let [deltaRow, deltaCol] = getPositionDifference(nodes[i], nodes[j]);

                    let nextAntinodePosition = nodes[i];
                    while (true) {
                        nextAntinodePosition = addPositions(nextAntinodePosition, [deltaRow, deltaCol]);
                        let [r, c] = nextAntinodePosition;
                        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) {
                            break;
                        }

                        uniqueAntinodesByPositionKey[nextAntinodePosition.join(',')] = true;
                    }

                    nextAntinodePosition = nodes[j];
                    while (true) {
                        nextAntinodePosition = addPositions(nextAntinodePosition, [-deltaRow, -deltaCol]);
                        let [r, c] = nextAntinodePosition;
                        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) {
                            break;
                        }

                        uniqueAntinodesByPositionKey[nextAntinodePosition.join(',')] = true;
                    }
                }
            }
        });

        return Object.keys(uniqueAntinodesByPositionKey).length;
    }

    let countTotalAntinodes = rawInput => {
        let grid = rawInput.split(/\n/).filter(el => el).map(row => row.split('').filter(el => el));

        // rules:
        // nodes only form antinodes with other nodes of the exact same value
        // it seems as though the number of antinodes formed should be the factorial of the number of nodes of that frequency
            // but since nodes can be formed "off grid", it doesn't quite work
        // antinodes have to be "perfectly in line", ie: have the same slope equation (otherwise you'd expect a "circle" of them, i think)

        // so the formula for antinodes is:
            // find the delta-row and delta-col between the two nodes of the same frequency
            // apply that same [delta-row, delta-col] shift to one of the nodes, and the inverse to the other
            // those are the antinodes (can check then and there if they are "on-grid" or filter them later)

        let nodesByFrequency = {};
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell.match(/[a-zA-Z0-9]/)) {
                    nodesByFrequency[cell] = nodesByFrequency[cell] || [];
                    nodesByFrequency[cell].push([rowIndex, colIndex]);
                }
            });
        });

        let uniqueAntinodesByPositionKey = {};
        Object.values(nodesByFrequency).forEach(nodes => {
            for (let i = 0; i < nodes.length - 1; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    let [deltaRow, deltaCol] = getPositionDifference(nodes[i], nodes[j]);
                    let antinodes = [addPositions(nodes[i], [deltaRow, deltaCol]), addPositions(nodes[j], [-deltaRow, -deltaCol])];
                    antinodes.forEach(pos => {
                        let [r, c] = pos;
                        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) {
                            // not a valid antinode
                            return;
                        }
                        uniqueAntinodesByPositionKey[pos.join(',')] = true;
                    });
                }
            }
        });

        return Object.keys(uniqueAntinodesByPositionKey).length;
    };

    return [countTotalAntinodes, countTotalAntinodesWithResonantHarmonics];
})();
