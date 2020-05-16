const dateUtils = require("../js/dateUtils");

test("Positive diff between dates", () => {
    const startDate = new Date("2019-01-01");
    const endDate = new Date("2019-02-01");

    expect(dateUtils.getDateDiff(startDate, endDate)).toEqual(-31);
})

test("Negative diff between dates", () => {
    const startDate = new Date("2019-01-01");
    const endDate = new Date("2019-02-01");

    expect(dateUtils.getDateDiff(endDate, startDate)).toEqual(31);
})

test("Format date", () => {
    const date = new Date("2020-05-06T14:32:43");

    expect(dateUtils.formatDate(date)).toEqual("2020-05-06");
})