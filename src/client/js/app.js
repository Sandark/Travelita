/* City search lookup */
const citySearchField = document.getElementById("city-search");
const suggestionBox = document.getElementById("city-suggestions");
let typingTimer;
const waitTime = 1000;

citySearchField.addEventListener("keyup", () => {
    typingTimer = setTimeout(() => {
        if (citySearchField.value.length < 3) {
            return;
        }

        getRequest(getApiBaseUrl() + "/city", {
            cityName: citySearchField.value
        }).then(v => {
            suggestionBox.innerHTML = "";
            let tempFragment = document.createDocumentFragment();
            v.geonames.map(g => {
                let cityFullName = [g.toponymName, g.adminName1, g.countryName].join(",");

                let cityAnchor = document.createElement("a");
                cityAnchor.setAttribute("data-name", cityFullName);
                cityAnchor.setAttribute("data-lng", g.lng);
                cityAnchor.setAttribute("data-lat", g.lat);
                cityAnchor.text = cityFullName;

                return cityAnchor;
            }).forEach(a => {
                tempFragment.appendChild(a);
            });

            suggestionBox.appendChild(tempFragment);
        })
    }, waitTime);
});

citySearchField.addEventListener("keydown", () => {
    clearTimeout(typingTimer);
})


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
