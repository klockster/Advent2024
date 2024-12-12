var day14 = (() => {
    // this draws the tree on the DOM so we can see if we are indeed looking at a tree:
    let drawRobots = (positions, iterationNumber) => {
        let answerElement = document.querySelector('.answer');

        let gridWidth = 101;
        let gridHeight = 103;

        let grid = [];
        for (let i = 0; i < gridHeight; i++) {
            let row = [];
            for (let j = 0; j < gridWidth; j++) {
                row.push('.');
            }
            grid.push(row);
        }

        positions.forEach(([x, y]) => {
            return grid[y][x] = grid[y][x] === '.' ? 1 : grid[y][x] + 1
        });

        let divs = grid.map(row => {
            let childElements = row.map(el => {
                let span = document.createElement('span');
                span.innerText = el;
                return span;
            });
            let div = document.createElement('div');
            childElements.forEach(c => div.appendChild(c));
            return div;
        });

        answerElement.innerHTML = '';
        let iteration = document.createElement('div');
        iteration.innerText = `Iteration number: ${iterationNumber}`;
        answerElement.appendChild(iteration);
        divs.forEach(d => answerElement.appendChild(d));
    };

    let simulateRobotsAndDraw = rawInput => {
        let positionVelocityPairs = rawInput.split(/\n/).filter(el => el).map(row => {
            let nums = row.match(/-?[0-9]+/g).map(n => parseInt(n, 10));
            return arrayChunk(nums, 2);
        });

        let gridWidth = 101;
        let gridHeight = 103;

        let iterations = 0;
        while (iterations < 100000) {
            iterations++;
            positionVelocityPairs = positionVelocityPairs.map(pair => {
                let [position, velocity] = pair;
                let posX = (position[0] + velocity[0] + gridWidth) % gridWidth;
                let posY = (position[1] + velocity[1] + gridHeight) % gridHeight;

                return [[posX, posY], velocity];
            });

            let positions = positionVelocityPairs.map(pair => pair[0]);
            let positionsHash = {};
            positions.forEach(pos => {
                let [x, y] = pos;
                positionsHash[x] = positionsHash[x] || {};
                positionsHash[x][y] = true;
            });

            let possibleXmasTree = positions.find(pos => {
                // we're going to pray that it fans out into a triangle of the form:
                //      1
                //     111
                //    11111
                //   1111111
                // as a part of the xmas tree and, furthermore, that it never does so except when forming the tree
                // so for every position, we check 3 levels below with an increasing fanout based on the depth
                let [x, y] = pos;
                for (let depth = 1; depth < 4; depth++) {
                    for (let i = 0; i < (2 * depth + 1); i++) {
                        let testX = x - depth + i;
                        let testY = y + depth;
                        if (!positionsHash[testX] || !positionsHash[testX][testY]) {
                            return false;
                        }
                    }
                }

                return true;
            });

            if (possibleXmasTree) {
                break;
            }

        }

        let positions = positionVelocityPairs.map(pair => pair[0]);
        // let's draw what it looks like so we can verify we're looking at an xmas tree
        setTimeout(() => drawRobots(positions, iterations), 200);

        return iterations;
    }

    let simulateRobotSafetyFactor = rawInput => {
        let positionVelocityPairs = rawInput.split(/\n/).filter(el => el).map(row => {
            let nums = row.match(/-?[0-9]+/g).map(n => parseInt(n, 10));
            return arrayChunk(nums, 2);
        });

        /*
        // these are the example grid dimensions:
        let gridWidth = 11;
        let gridHeight = 7;
        */
        let gridWidth = 101;
        let gridHeight = 103;
        console.log(`Using grid size width=${gridWidth} and height=${gridHeight}`);

        let iterations = 100;
        let finalPositions = positionVelocityPairs.map(pair => {
            // since you wrap after gridWidth, your position-X is basically 100 * velocity-X % gridWidth?
            let [startPosition, velocity] = pair;
            let posX = (((startPosition[0] + iterations * velocity[0]) % gridWidth) + gridWidth) % gridWidth;
            let posY = (((startPosition[1] + iterations * velocity[1]) % gridHeight) + gridHeight) % gridHeight;

            return [posX, posY];
        });

        // ok, quadrants... that's an interesting idea
        let quadrantCounts = {};
        finalPositions.forEach(pos => {
            let splitLineX = (gridWidth - 1) / 2;
            let splitLineY = (gridHeight - 1) / 2;
            let [x, y] = pos;
            if (x < splitLineX && y < splitLineY) {
                quadrantCounts[0] = (quadrantCounts[0] || 0) + 1;
            }
            if (x > splitLineX && y < splitLineY) {
                quadrantCounts[1] = (quadrantCounts[1] || 0) + 1;
            }
            if (x < splitLineX && y > splitLineY) {
                quadrantCounts[2] = (quadrantCounts[2] || 0) + 1;
            }
            if (x > splitLineX && y > splitLineY) {
                quadrantCounts[3] = (quadrantCounts[3] || 0) + 1;
            }
        });

        return Object.values(quadrantCounts).reduce((a, e) => a * e, 1);
    };

    return [simulateRobotSafetyFactor, simulateRobotsAndDraw];
})();
