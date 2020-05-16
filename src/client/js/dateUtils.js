/**
 * Calculates difference between provided date and now, returns integer value of difference.
 * @param targetDate
 * @returns {number} returns negative if before now(), otherwise it's positive.
 */
function getDateDiffFromNow(targetDate) {
    const diffTime = targetDate - new Date();
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

    const diffDays = getDateDiffFromNow(startDate);
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

    return dueDaysValue
}

function calculatePastTripDiff(endDate) {
    const diffEndDays = getDateDiffFromNow(endDate);

    if (diffEndDays === 0) {
        return "Ending today";
    } else if (diffEndDays > 0) {
        return "In progress";
    } else {
        return `${Math.abs(diffEndDays)} days away`;
    }
}

module.exports = {
    getDateDiffFromNow,
    formatDate,
    generateDueDaysString
}