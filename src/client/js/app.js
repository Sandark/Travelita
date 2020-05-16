const entryController = require("./entryController");
const entryView = require("./entryView");
const httpRequest = require("./httpRequest");

const travelEntries = document.querySelector(".travel_content");

/* Load existing data */
setTimeout(() => {
    httpRequest.getRequest("/tripsWithItems")
        .then(trips => {
            trips.forEach(trip => {
                createEntry(trip)
            })
        })
}, 0);

function createEntry(entryParams, elementId = generateId(5)) {
    let entryHtml = entryView.getEntryHtml(elementId);
    let temp = document.createElement('template');
    temp.innerHTML = entryHtml;
    travelEntries.append(temp.content);

    entryController.assignTripEntryFunctions(elementId, entryParams);
}

document.getElementById("create-entry").addEventListener("click", () => {
    createEntry({
        img_src: "https://cdn.pixabay.com/photo/2020/05/04/16/05/mckenzie-river-5129717_960_720.jpg"
    });
});

function generateId(length = 10) {
    return Array(10).fill(null).map(() => Math.random().toString(36).substr(2)).join('').substr(0, length);
}