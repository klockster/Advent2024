var day9 = (() => {
    let getChecksumAfterWholeFileMovement = rawInput => {
        let pairs = rawInput.match(/[0-9]{1,2}/g);
        let nonCompactDisk = [];
        pairs.forEach((pairStr, fileIndex) => {
            let [size, freeSpaceAfter] = pairStr.split('').map(n => parseInt(n));
            // in case there's only 1 entry in the pair string
            freeSpaceAfter = freeSpaceAfter || 0;

            assert(size > 0, 'size should be nonzero');
            nonCompactDisk.push({ fileIndex, size, freeSpaceAfter });
        });

        for (let i = nonCompactDisk.length - 1; i > 0; i--) {
            let leftMovableFile = nonCompactDisk[i];

            for (let j = 0; j < i; j++) {
                let targetAfterFile = nonCompactDisk[j];
                if (targetAfterFile.freeSpaceAfter >= leftMovableFile.size) {
                    nonCompactDisk.splice(i, 1);
                    nonCompactDisk.splice(j + 1, 0, leftMovableFile);

                    let spaceAfterMovedFileBeforeMove = leftMovableFile.freeSpaceAfter;
                    leftMovableFile.freeSpaceAfter = targetAfterFile.freeSpaceAfter - leftMovableFile.size;

                    // note: this [i] is now the one that was right before the leftMovableFile
                    // the gap left behidn by moving a file is equal to how much space was after the moved file, plus
                    // the size of the file itself (plus the gap that existed before)
                    nonCompactDisk[i].freeSpaceAfter += (leftMovableFile.size + spaceAfterMovedFileBeforeMove);

                    targetAfterFile.freeSpaceAfter = 0;
                    // since we spliced, we now need to consider whatever is at "i" now, so we ++ to cancel out the --
                    i++;
                    break;
                }
            }
        }

        // there's probably a better way to do this, but it was easy copypasta on the `reduce` haha
        return nonCompactDisk.map(el => new Array(el.size + el.freeSpaceAfter).fill(0).fill(el.fileIndex, 0, el.size))
            .flat()
            .reduce((a, e, i) => a + (e * i), 0);
    };

    let getChecksumAfterFileCompaction = rawInput => {
        let pairs = rawInput.match(/[0-9]{1,2}/g);
        let nonCompactDisk = [];
        pairs.forEach((pairStr, fileIndex) => {
            let [a, b] = pairStr.split('').map(n => parseInt(n));
            // in case there's only 1 entry in the pair string
            b = b || 0;

            for (let i = 0; i < a; i++) {
                nonCompactDisk.push(fileIndex);
            }
            for (let i = 0; i < b; i++) {
                nonCompactDisk.push(null);
            }
        });

        // vaguely, I want to make an array from the original format
        // then go through and for each hole in the array (undefined/null)
        // pop something off the end of the array until you pop a non-null
        // put that in this new location

        for (let i = 0; i < nonCompactDisk.length; i++) {
            if (nonCompactDisk[i] !== null) {
                continue;
            }

            let candidate = nonCompactDisk.pop();
            while (candidate === null && i < nonCompactDisk.length) {
                candidate = nonCompactDisk.pop();
            }

            nonCompactDisk[i] = candidate;
        }

        return nonCompactDisk.reduce((a, e, i) => a + (e * i), 0);
    };

    return [getChecksumAfterFileCompaction, getChecksumAfterWholeFileMovement];
})();
