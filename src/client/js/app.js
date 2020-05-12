/* City search lookup */
const travelEntries = document.getElementsByClassName("entry");
let typingTimer;
const waitTime = 1000;

travelEntries.forEach(travelEntry => {
    const travelImage = travelEntry.getElementsByClassName("trip_image")[0];
    const travelName = travelEntry.getElementsByClassName("trip_name")[0];
    const citySearch = travelEntry.getElementsByClassName("city_search")[0];
    const citySearchInput = travelEntry.getElementsByClassName("city_search_input")[0];
    let suggestionDiv;

    citySearchInput.addEventListener("keyup", () => {
        typingTimer = setTimeout(() => {
            if (citySearchInput.value.length < 3) {
                return;
            }

            getRequest(getApiBaseUrl() + "/city", {
                cityName: citySearchInput.value
            }).then(v => {
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
            })
        }, waitTime);
    });

    citySearchInput.addEventListener("keydown", () => {
        clearTimeout(typingTimer);
    })

    function applyCity(evt) {
        let e = evt || window.event;
        let target = e.target || e.srcElement;
        console.log(target);

        citySearchInput.value = target.getAttribute("data-name");
        travelName.textContent = target.getAttribute("data-city");

        getRequest(getApiBaseUrl() + "/img", {q: target.getAttribute("data-city")})
            .then(value => {
                if (Object.keys(value).length > 0) {
                    travelImage.src = value.hits[Math.floor(Math.random() * value.hits.length)].webformatURL;
                    travelImage.alt = target.getAttribute("data-city");
                }
            });

        closeAllSuggestions();
    }

    function closeAllSuggestions() {
        let allSuggestions = document.getElementsByClassName("suggestion_box");
        allSuggestions.forEach(sBox => {
            sBox.parentNode.removeChild(sBox);
        })
    }

});

async function getRequest(url, params = "") {
    let compiledUrl = new URL(url);
    Object.keys(params).forEach(key => compiledUrl.searchParams.append(key, params[key]));

    let res = await fetch(compiledUrl);
    try {
        return await res.json();
    } catch (error) {
        console.log("error", error);
    }
}

function getApiBaseUrl() {
    return "http://" + [window.location.hostname, window.location.port].join(":");
}
