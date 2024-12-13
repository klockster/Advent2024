var day17 = (() => {
    // what a pain: JavaScript converts numbers to 32 bits before doing bitwise operators
    // so once the numbers get high enough the answer ends up negative
    let myXOR = (a, b) => {
        let binA = a.toString(2);
        let binB = b.toString(2);

        binA = binA.padStart(binB.length, '0');
        binB = binB.padStart(binA.length, '0');

        let result = '';
        for (let i = 0; i < binA.length; i++) {
            let concat = binA[i] + binB[i];
            if (concat === '01' || concat === '10') {
                result = result + '1';
                continue;
            }

            result = result + '0';
        }

        return parseInt(result, 2);
    };

    let getOutputFromProgram = (registers, program) => {
        let output = [];
        let instructionPointer = 0;
        let [registerA, registerB, registerC] = registers;
        while (program[instructionPointer] !== undefined) {
            let currentInstruction = program[instructionPointer];
            let operand = program[instructionPointer + 1];
            assert(operand !== undefined, "Operand should not be undefined, hopefully??");
            let combos = [0, 1, 2, 3, registerA, registerB, registerC];

            switch (currentInstruction) {
                case 0:
                    registerA = parseInt(registerA / Math.pow(2, combos[operand]), 10);
                    instructionPointer += 2;
                    break;
                case 1:
                    // registerB = registerB ^ operand;
                    registerB = myXOR(registerB, operand);
                    instructionPointer += 2;
                    break;
                case 2:
                    registerB = combos[operand] % 8;
                    instructionPointer += 2;
                    break;
                case 3:
                    if (registerA === 0) {
                        instructionPointer += 2;
                    } else {
                        instructionPointer = operand;
                    }
                    break;
                case 4:
                    registerB = myXOR(registerB, registerC);
                    instructionPointer += 2;
                    break;
                case 5:
                    output.push(combos[operand] % 8);
                    instructionPointer += 2;
                    break;
                case 6:
                    registerB = parseInt(registerA / Math.pow(2, combos[operand]), 10);
                    instructionPointer += 2;
                    break;
                case 7:
                    registerC = parseInt(registerA / Math.pow(2, combos[operand]), 10);
                    instructionPointer += 2;
                    break;
                default:
                    assert(false, `Invalid instruction ${currentInstruction}`);
            }
        }

        return output;
    };

    let getLowestRegisterThatOutputsProgram = rawInput => {
        let [registers, program] = rawInput.split(/\n\n/).filter(el => el)
            .map(str => str.match(/\d+/g).map(n => parseInt(n, 10)));

        // there is something interesting happening.  If the number placed into registerA is converted to octal
        // then the same first digit of that input will always produce the same last digit of the output
        // the same second digit of that input will always produce the same 2nd-to-last digit of the output
        // and so on.

        let digitsToMatch = [...program];
        console.log(digitsToMatch.join(','));
        let octalDigits = '';

        for (let i = 0; i < digitsToMatch.length; i++) {
            let found = false;
            let nextMatchableDigit = digitsToMatch[digitsToMatch.length - 1 - i];
            let start = i === 0 ? 1 : 0;
            while (!found) {
                for (let digit = start; digit < 8; digit++) {
                    let attempt = parseInt(`${octalDigits}${digit}`, 8);
                    let o = getOutputFromProgram([attempt, ...registers.slice(1)], program);
                    if (o.join(',') === digitsToMatch.slice(digitsToMatch.length - (1 + i)).join(',')) {
                        octalDigits = octalDigits + digit;
                        found = true;
                        break;
                    }
                }

                if (found) {
                    break;
                }

                // this means we didn't find anything...
                i = i - 1;
                start = parseInt(octalDigits.slice(octalDigits.length - 1), 10) + 1;
                octalDigits = octalDigits.slice(0, octalDigits.length - 1);
                nextMatchableDigit = digitsToMatch[digitsToMatch.length - 1 - i];
                if (i < 0) {
                    assert(false, 'uh oh');
                }
            }
        }

        // console.log('octalDigits', octalDigits, parseInt(octalDigits, 8));
        return parseInt(octalDigits, 8);
    }

    let runDebuggerProgram = rawInput => {
        let [registers, program] = rawInput.split(/\n\n/).filter(el => el)
            .map(str => str.match(/\d+/g).map(n => parseInt(n, 10)));

        let output = getOutputFromProgram(registers, program);
        return output.join(',');
    };

    return [runDebuggerProgram, getLowestRegisterThatOutputsProgram];
})();
