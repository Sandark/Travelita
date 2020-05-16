const httpRequest = require("./httpRequest");
const weatherCodesMapping = require("./weatherCodeMapping");
const dateUtils = require("./dateUtils");

/* Initialize Entry view with provided parameters and assign event handlers to elements */
function assignTripEntryFunctions(elementId, entryParams) {
    let typingTimer;
    const waitTime = 500;

    /* Retrieve all children of trip entry */
    const tripEntry = document.getElementById(elementId);

    const tripImage = tripEntry.getElementsByClassName("trip_image")[0];
    const tripName = tripEntry.getElementsByClassName("trip_name")[0];
    const dueDays = tripEntry.getElementsByClassName("trip_due_days")[0];
    const citySearch = tripEntry.getElementsByClassName("city_search")[0];
    const citySearchInput = tripEntry.getElementsByClassName("city_search_input")[0];
    const weatherTemps = tripEntry.getElementsByClassName("weather_temps")[0];
    const weatherIcon = tripEntry.getElementsByClassName("weather_icon")[0];
    const dateFrom = tripEntry.getElementsByClassName("date_from")[0];
    const dateTo = tripEntry.getElementsByClassName("date_to")[0];
    const deleteEntryButton = tripEntry.getElementsByClassName("button_delete_entry")[0];
    const saveEntryButton = tripEntry.getElementsByClassName("button_save_entry")[0];

    let suggestionDiv;

    /* Fill entry with initial data if params are provided */
    fillEntryWithData(entryParams, tripEntry, tripImage, tripName, citySearchInput, dateFrom, dateTo, generateDueDays);
    generateDueDays();

    /* Listen changes to city input field, create suggestion box based on retrieved data */
    citySearchInput.addEventListener("keyup", () => {
        closeAllSuggestions();
        clearTimeout(typingTimer);

        typingTimer = setTimeout(() => {
            if (citySearchInput.value.length < 3) {
                return;
            }

            httpRequest.getRequest("/city", {
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

    async function applyCity(evt) {
        let e = evt || window.event;
        let target = e.target || e.srcElement;

        closeAllSuggestions();
        citySearchInput.value = target.getAttribute("data-name");
        tripEntry.setAttribute("data-lat", target.getAttribute("data-lat"));
        tripEntry.setAttribute("data-lng", target.getAttribute("data-lng"));
        tripName.textContent = target.getAttribute("data-city");

        await httpRequest.getRequest("/img", {q: target.getAttribute("data-city")})
            .then(async response => {
                if (response.total === 0) {
                    return await httpRequest.getRequest("/img", {q: "travel"});
                }
                return response;
            }).then(response => {
                tripImage.src = response.hits[Math.floor(Math.random() * response.hits.length)].webformatURL;
                tripImage.alt = target.getAttribute("data-city");
            }).then(() => {
                requestWeather();
            });
    }

    deleteEntryButton.addEventListener("click", () => {
        tripEntry.parentNode.removeChild(tripEntry);
        if (tripEntry.getAttribute("data-id")) {
            httpRequest.deleteRequest("/trips", tripEntry.getAttribute("data-id"))
                .then(res => console.log(res));
        }
    });

    saveEntryButton.addEventListener("click", () => {
        let techId = tripEntry.getAttribute("data-id");
        const saveParams = {
            id: techId,
            name: tripName.innerText,
            img_src: tripImage.src,
            city_full_name: citySearchInput.value,
            from_date: dateFrom.valueAsDate,
            to_date: dateTo.valueAsDate,
            lat: tripEntry.getAttribute("data-lat"),
            lng: tripEntry.getAttribute("data-lng")
        }

        if (techId) {
            httpRequest.putRequest(`/trips/${techId}`, saveParams);
        } else {
            httpRequest.postRequest("/trips", saveParams)
                .then(res => {
                    tripEntry.setAttribute("data-id", res.id);
                    console.log(res.message);
                });
        }
    });

    dateFrom.addEventListener("change", () => {
        if (dateFrom.valueAsDate > dateTo.valueAsDate) {
            dateTo.value = dateUtils.formatDate(dateFrom.valueAsDate);
        }

        generateDueDays();
        requestWeather();
    })

    dateTo.addEventListener("change", () => {
        if (dateTo.valueAsDate < dateFrom.valueAsDate) {
            dateFrom.value = dateUtils.formatDate(dateTo.valueAsDate);
        }

        generateDueDays();
        requestWeather();
    })

    function closeAllSuggestions() {
        let allSuggestions = document.getElementsByClassName("suggestion_box");
        allSuggestions.forEach(sBox => {
            sBox.parentNode.removeChild(sBox);
        })
    }

    function generateDueDays() {
        if (dateFrom.valueAsDate === null || dateTo.valueAsDate === null) {
            return;
        }

        dueDays.innerText = dateUtils.generateDueDaysString(dateFrom.valueAsDate, dateTo.valueAsDate);
    }

    function requestWeather() {
        if (dateFrom.valueAsDate === null || dateTo.valueAsDate === null) {
            return;
        }
        let startDate = dateFrom.valueAsDate;

        const diffDays = Math.abs(dateUtils.getDateDiffFromNow(startDate));

        if (diffDays >= 16) {
            requestHistoricalWeatherForDate(startDate, tripEntry, weatherTemps);
        } else {
            requestWeatherForecastFor16Days(tripEntry, diffDays, weatherTemps, weatherIcon);
        }
    }
}

/**
 * Once data is provided from server side - information can be inserted in DOM
 */
function fillEntryWithData(entryParams, tripEntry, tripImage, tripName, citySearchInput, dateFrom, dateTo) {
    if (entryParams.id) {
        tripEntry.setAttribute("data-id", entryParams.id);
    }

    if (entryParams.img_src) {
        tripImage.src = entryParams.img_src;
    }

    if (entryParams.name) {
        tripName.innerText = entryParams.name;
        tripImage.alt = entryParams.name;
    }

    if (entryParams.city_full_name) {
        citySearchInput.value = entryParams.city_full_name;
    }

    if (entryParams.from_date !== undefined && entryParams.to_date !== undefined) {
        dateFrom.value = dateUtils.formatDate(new Date(entryParams.from_date));
        dateTo.value = dateUtils.formatDate(new Date(entryParams.to_date));
    }

    if (entryParams.lat !== undefined && entryParams.lng !== undefined) {
        tripEntry.setAttribute("data-lat", entryParams.lat);
        tripEntry.setAttribute("data-lng", entryParams.lng);
    }
}

/* Request forecast of historical data for place using lat/lng data.
*  In case of historical data - one year is withdrawn from requested date.
* */
function requestHistoricalWeatherForDate(startDate, tripEntry, weatherTemps) {
    startDate.setDate(startDate.getDate());
    startDate.setFullYear(startDate.getFullYear() - 1);

    httpRequest.getRequest("/weatherHistory", {
        start_date: startDate.toISOString().split('T')[0],
        lat: tripEntry.getAttribute("data-lat"),
        lng: tripEntry.getAttribute("data-lng")
    }).then(response => {
        weatherTemps.innerText = `Usual weather:\n${response.min_temp}°C / ${response.max_temp}°C`;
    })
}

function requestWeatherForecastFor16Days(tripEntry, diffDays, weatherTemps, weatherIcon) {
    httpRequest.getRequest("/weather", {
        lat: tripEntry.getAttribute("data-lat"),
        lng: tripEntry.getAttribute("data-lng")
    }).then(response => {
        let temperatureAtFirstDay = response[diffDays];
        weatherTemps.innerText = `Forecast:\n${temperatureAtFirstDay.min_temp}°C / ${temperatureAtFirstDay.max_temp}°C`;
        weatherIcon.classList.add(weatherCodesMapping.getClassFromWeatherCode(temperatureAtFirstDay.weather_code));
    })
}

module.exports = {
    assignTripEntryFunctions
}