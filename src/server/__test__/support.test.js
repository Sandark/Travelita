const corejs = require("core-js/stable");
const regenerator = require("regenerator-runtime/runtime");

const support = require("../support");

describe("Test support class", () => {

    it("Generate URL w/o params", () => {
        expect(support.compileUrl("http://base.url/trips", {}).toString()).toEqual("http://base.url/trips");
    })

    it("Generate URL with params", () => {
        expect(support.compileUrl("http://base.url/trips", {
            id: 2,
            trip: 5000
        }).toString()).toEqual("http://base.url/trips?id=2&trip=5000");
    })
})