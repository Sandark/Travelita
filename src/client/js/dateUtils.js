/**
 * Calculates difference between provided date and now, returns integer value of difference.
 * @param startDate
 * @returns {number} returns negative if before now(), otherwise it's positive.
 */
function getDateDiff(startDate, endDate = new Date()) {
    const diffTime = startDate - endDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formats date to YYYY-MM-DD format that is useful for input[date] fields or as parameter for get/post requests
 * @param date
 * @returns {string}
 */
function formatDate(date) {
    return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
        '-' + date.getDate().toString().padStart(2, 0);
}

/**
 * Generates string that specifies how much days left or how much days away from specified range.
 * @param startDate
 * @param endDate
 * @returns {string}
 */
function generateDueDaysString(startDate, endDate) {
    if (startDate === null || endDate === null) {
        return "";
    }

    const diffDays = getDateDiff(startDate);
    let dueDaysValue;

    if (diffDays === 1) {
        dueDaysValue = "Tomorrow"
    } else if (diffDays > 1) {
        dueDaysValue = `In ${diffDays} days`;
    } else if (diffDays === 0) {
        dueDaysValue = "Today";
    } else {
        dueDaysValue = calculatePastTripDiff(endDate);
    }

    const amountOfDays = Math.abs(getDateDiff(startDate, endDate)) + 1;

    return dueDaysValue + `\n${amountOfDays} days long`;
}

function calculatePastTripDiff(endDate) {
    const diffEndDays = getDateDiff(endDate);

    if (diffEndDays === 0) {
        return "Ending today";
    } else if (diffEndDays > 0) {
        return "In progress";
    } else {
        return `${Math.abs(diffEndDays)} days away`;
    }
}

module.exports = {
    getDateDiff,
    formatDate,
    generateDueDaysString
}