var day3 = (() => {
    let sumMulInstructionsWithConditionals = rawInput => {
        let remainder = rawInput;
        let matches;
        matches = remainder.match(/(mul\(([0-9]{1,3}),([0-9]{1,3})\)|do\(\)|don't)/);
        let result = 0;
        let enabled = true;

        while (matches && remainder) {
            if (matches[0].slice(0, 3) === 'mul' && enabled) {
                result = result + (parseInt(matches[2], 10) * parseInt(matches[3], 10));
            } else if (matches[0].slice(0, 3) === 'do(') {
                enabled = true;
            } else {
                enabled = false;
            }

            remainder = remainder.slice(matches.index + matches[0].length);
            matches = remainder.match(/(mul\(([0-9]{1,3}),([0-9]{1,3})\)|do\(\)|don't)/);
        }

        return result;
    };

    let sumValidMulInstructions = rawInput => {
        let matches = rawInput.match(/mul\(([0-9]{1,3}),([0-9]{1,3})\)/g);
        return matches.map(str => str.match(/[0-9]+/g).map(n => parseInt(n, 10)).reduce((a, e) => a * e, 1))
            .reduce((a, e) => a + e, 0);
    };

    return [sumValidMulInstructions, sumMulInstructionsWithConditionals];
})();
