const httpRequest = require("./httpRequest");

/* City search lookup */
const travelEntries = document.querySelector(".travel_content");

function assignTripEntryFunctions(entryParams) {
    let typingTimer;
    const waitTime = 1000;

    const travelEntry = document.getElementById(entryParams.id);

    const tripImage = travelEntry.getElementsByClassName("trip_image")[0];
    const travelName = travelEntry.getElementsByClassName("trip_name")[0];
    const dueDays = travelEntry.getElementsByClassName("trip_due_days")[0];
    const citySearch = travelEntry.getElementsByClassName("city_search")[0];
    const citySearchInput = travelEntry.getElementsByClassName("city_search_input")[0];
    const weatherForecast = travelEntry.getElementsByClassName("weather_forecast")[0];
    const dateFrom = travelEntry.getElementsByClassName("date_from")[0];
    const dateTo = travelEntry.getElementsByClassName("date_to")[0];
    const deleteEntry = travelEntry.getElementsByClassName("button_delete_entry")[0];
    let suggestionDiv;

    if (entryParams.img_src) {
        tripImage.src = entryParams.img_src;
    }

    if (entryParams.name) {
        travelName.innerText = entryParams.name;
        tripImage.alt = entryParams.name;
    }

    if (entryParams.city_full_name) {
        citySearchInput.value = entryParams.city_full_name;
    }

    if (entryParams.from_date !== undefined && entryParams.to_date !== undefined) {
        dateFrom.value = formatDate(new Date(entryParams.from_date));
        dateTo.value = formatDate(new Date(entryParams.to_date));
        dueDays.innerText = generateDueDays();
    }

    citySearchInput.addEventListener("keyup", () => {
        typingTimer = setTimeout(() => {
            if (citySearchInput.value.length < 3) {
                return;
            }

            httpRequest.getRequest(getApiBaseUrl() + "/city", {
                cityName: citySearchInput.value
            }).then(v => {
                createSuggestionBox(v);
            })
        }, waitTime);
    });

    function createSuggestionBox(v) {
        closeAllSuggestions();
        suggestionDiv = document.createElement("div");
        suggestionDiv.classList.add("suggestion_box");
        v.geonames.map(g => {
            let cityFullName = [g.toponymName, g.countryName].join(",");

            let cityAnchor = document.createElement("a");
            cityAnchor.setAttribute("data-city", g.toponymName);
            cityAnchor.setAttribute("data-name", cityFullName);
            cityAnchor.setAttribute("data-lng", g.lng);
            cityAnchor.setAttribute("data-lat", g.lat);
            cityAnchor.text = cityFullName;

            cityAnchor.addEventListener("click", applyCity);

            return cityAnchor;
        }).forEach(a => {
            suggestionDiv.appendChild(a);
        });

        citySearch.appendChild(suggestionDiv);
    }

    citySearchInput.addEventListener("keydown", () => {
        clearTimeout(typingTimer);
    })

    async function applyCity(evt) {
        let e = evt || window.event;
        let target = e.target || e.srcElement;

        closeAllSuggestions();
        citySearchInput.value = target.getAttribute("data-name");
        travelName.textContent = target.getAttribute("data-city");

        await httpRequest.getRequest(getApiBaseUrl() + "/img", {q: target.getAttribute("data-city")})
            .then(async response => {
                if (response.total === 0) {
                    return await getRequest(getApiBaseUrl() + "/img", {q: "travel"});
                }
                return response;
            }).then(response => {
                tripImage.src = response.hits[Math.floor(Math.random() * response.hits.length)].webformatURL;
                tripImage.alt = target.getAttribute("data-city");
            }).then(() => {
                retrieveWeather(target);
            });
    }

    function retrieveWeather(target) {
        if(dateFrom.value === undefined || dateTo.value === undefined) {
            return;
        }
        let startDate = dateFrom.valueAsDate;

        const diffTime = Math.abs(startDate - new Date());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 16) {
            startDate.setDate(startDate.getDate() + 1);
            startDate.setFullYear(startDate.getFullYear() - 1);
            let nextDate = new Date();
            nextDate.setDate(startDate.getDate() + 1);
            nextDate.setMonth(startDate.getMonth());
            nextDate.setFullYear(startDate.getFullYear());

            httpRequest.getRequest(getApiBaseUrl() + "/weatherHistory", {
                start_date: startDate.toISOString().split('T')[0],
                end_date: nextDate.toISOString().split('T')[0],
                lat: target.getAttribute("data-lat"),
                lng: target.getAttribute("data-lng")
            }).then(response => {
                weatherForecast.innerText = `Typical weather for those days\nMax: ${response.max_temp} - Min: ${response.min_temp}`;
            })
        } else {
            httpRequest.getRequest(getApiBaseUrl() + "/weather", {
                lat: target.getAttribute("data-lat"),
                lng: target.getAttribute("data-lng")
            }).then(response => {
                let temperatureAtStartDay = response[diffDays];
                weatherForecast.innerText = `Expected temperature at `;
            })
        }
    }

    deleteEntry.addEventListener("click", () => {
        travelEntry.parentNode.removeChild(travelEntry);
    })

    function closeAllSuggestions() {
        let allSuggestions = document.getElementsByClassName("suggestion_box");
        allSuggestions.forEach(sBox => {
            sBox.parentNode.removeChild(sBox);
        })
    }

    function generateDueDays() {
        const diffTime = Math.abs(dateFrom.valueAsDate - new Date());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return "Tomorrow"
        } else if (diffDays > 1) {
            return `In ${diffDays} days`;
        } else if (diffDays === 0) {
            return "Today";
        } else {
            const diffEndTime = Math.abs(dateTo.valueAsDate - new Date());
            const diffEndDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffEndDays === 0) {
                return "Ending today";
            } else {
                return `${Math.abs(diffEndDays)} days away`;
            }
        }
    }
}




function formatDate(date) {
    return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
        '-' + date.getDate().toString().padStart(2, 0);
}

function getApiBaseUrl() {
    if (window.location.hostname === "localhost") {
        return "http://" + [window.location.hostname, window.location.port].join(":")
    }

    return "https://" + [window.location.hostname, window.location.port].join(":");
}

function getEntryHtml(id) {
    return `<div class="entry" id="${id}">
            <div class="image_holder">
                <img class="trip_image">
                <div class="image_shadow">
                    <div class="trip_name"></div>
                    <div class="trip_due_days"></div>
                </div>
                <div class="entry_actions">
                    <button type="button" class="button_save_entry">Save</button>
                    <button type="button" class="button_delete_entry">Delete</button>
                </div>
            </div>
            <div class="trip_info">
                <div class="city_search">
                    <input type="text" class="city_search_input" autocomplete="off" placeholder="City">
                </div>
                <div class="dates_selection">
                    <input class="date_from" type="date" placeholder="FROM">
                    <input class="date_to" type="date" placeholder="FROM">
                </div>
                <div class="weather_forecast">

                </div>
            </div>
        </div>`
}

function createEntry(entryParams) {
    let entryHtml = getEntryHtml(entryParams.id);
    let temp = document.createElement('template');
    temp.innerHTML = entryHtml;
    travelEntries.append(temp.content);

    assignTripEntryFunctions(entryParams);
}

document.getElementById("create-entry").addEventListener("click", event => {
    createEntry({
        id: generateId(5),
        img_src: "https://cdn.pixabay.com/photo/2020/05/04/16/05/mckenzie-river-5129717_960_720.jpg"
    });
});

function generateId(length = 10) {
    return Array(10).fill(null).map(() => Math.random().toString(36).substr(2)).join('').substr(0, length);
}

/* Load existing data */
setTimeout(() => {
    httpRequest.getRequest(getApiBaseUrl() + "/trips")
        .then(trips => {
            trips.forEach(trip => {
                createEntry(trip)
            })
        })
}, 0);