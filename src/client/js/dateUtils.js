function getDateDiffs(startDate) {
    const diffTime = startDate - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatDate(date) {
    return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
        '-' + date.getDate().toString().padStart(2, 0);
}

module.exports = {
    getDateDiffs,
    formatDate
}