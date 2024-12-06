var day7 = (() => {
    // values is an array that begins with the remainder of the testValue, and the rest of the array are the operands
    // hasValidOperatorInsertions and this function below both work backward by popping operands off the values array,
    // testing the inverse of the allowed operands (multiply becomes divide, add becomes subtract, concat becomes slice)
    // then applying that inverse operator to the testValue and recursing (with a new testValue and one fewer operand)
    let hasValidOperatorInsertionsWithConcat = values => {
        values = [...values];
        let nextValue = values.pop();
        if (values.length === 1) {
            return nextValue === values[0];
        }

        // okay, in order to work backward, we need a new strategy
        // for example, take the 7290 = 6 * 8 || 6 * 15, this ends up 486 * 15
            // so reverse of concat is to just break off the last digit(s), right?
            // if the last N digits of the current values[0] are equal to nextValue, then you can do that, right?

        if (
            values[0] % nextValue === 0 &&
            hasValidOperatorInsertionsWithConcat([values[0] / nextValue].concat(values.slice(1)))
        ) {
            return true;
        }

        if (hasValidOperatorInsertionsWithConcat([values[0] - nextValue, ...values.slice(1)])) {
            return true;
        }

        // lastly, we can check out concat
        let testValueString = `${values[0]}`;
        let nextValueString = `${nextValue}`;

        if (testValueString.lastIndexOf(nextValueString) === testValueString.length - nextValueString.length) {
            return hasValidOperatorInsertionsWithConcat(
                [parseInt(testValueString.slice(0, testValueString.length - nextValueString.length), 10), ...values.slice(1)]
            );
        }

        return false;
    };

    let sumPossibleTestValuesWithConcat = rawInput => {
        let rows = rawInput.split(/\n/).filter(el => el).map(row => row.split(/:?\s+/).map(n => parseInt(n, 10)));
        return rows.filter(row => hasValidOperatorInsertionsWithConcat(row)).map(row => row[0]).reduce((a, e) => a + e, 0);
    };

    let hasValidOperatorInsertions = values => {
        values = [...values];
        let nextValue = values.pop();
        if (values.length === 1) {
            return nextValue === values[0];
        }

        if (values[0] % nextValue === 0) {
            return hasValidOperatorInsertions([values[0] / nextValue].concat(values.slice(1))) ||
                hasValidOperatorInsertions([values[0] - nextValue, ...values.slice(1)]);
        }

        return hasValidOperatorInsertions([values[0] - nextValue, ...values.slice(1)]);
    };

    let sumPossibleTestValues = rawInput => {
        let rows = rawInput.split(/\n/).filter(el => el).map(row => row.split(/:?\s+/).map(n => parseInt(n, 10)));
        return rows.filter(row => hasValidOperatorInsertions(row)).map(row => row[0]).reduce((a, e) => a + e, 0);
    };

    return [sumPossibleTestValues, sumPossibleTestValuesWithConcat];
})();
