var day2 = (() => {
    let isReportSafeWithProblemDampener = report => {
        if (isReportSafe(report)) {
            return true;
        }

        // i originally thought you could just look for the first index-pair that showed a problem and remove one or the other of those
        // but for some reason that didn't work on a couple reports, so just try removing every single index:
        for (let i = 0; i < report.length; i++) {
            let oneLevelRemoved = [...report];
            oneLevelRemoved.splice(i, 1);
            if (isReportSafe(oneLevelRemoved)) {
                return true;
            }
        }

        return false;
    };

    let countSafeReportsWithProblemDampener = rawInput => {
        let reports = rawInput.split(/\n/).filter(el => el)
            .map(row => row.split(/\s+/).filter(el => el).map(n => parseInt(n, 10)));

        return reports.filter(report => isReportSafeWithProblemDampener(report)).length;
    };

    let isReportSafe = report => {
        let direction = report[1] - report[0];
        for (let i = 1; i < report.length; i++) {
            let diff = report[i] - report[i - 1];
            // to see that it's always going in the same direction, just make sure the product of the difference between these
            // two items and the difference of the first two items is never negative
            // because both diffs must have the same sign, either -N * -M (positive) or N * M (positive)
            if (diff === 0 || Math.abs(diff) > 3 || diff * direction < 0) {
                return false;
            }
        }

        return true;
    };

    let countSafeReports = rawInput => {
        let reports = rawInput.split(/\n/).filter(el => el)
            .map(row => row.split(/\s+/).filter(el => el).map(n => parseInt(n, 10)));

        return reports.filter(report => isReportSafe(report)).length;
    };

    return [countSafeReports, countSafeReportsWithProblemDampener];
})();
