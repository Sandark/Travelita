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
                cityAnchor.setAttribute("data-city", g.toponymName);
                cityAnchor.setAttribute("data-name", cityFullName);
                cityAnchor.setAttribute("data-lng", g.lng);
                cityAnchor.setAttribute("data-lat", g.lat);
                cityAnchor.setAttribute("onclick", "Client.applyCity()");
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

document.body.addEventListener('click', function (event) {
    if (!suggestionBox.contains(event.target)) {
        console.log('clicked inside');
        suggestionBox.innerHTML = "";
    }
});

function applyCity(evt) {
    let e = evt || window.event;
    let target = e.target || e.srcElement;
    console.log(target);

    citySearchField.value = target.getAttribute("data-name");

    getRequest(getApiBaseUrl() + "/img", {q: target.getAttribute("data-city")})
        .then(value => {
            let url = value.hits[Math.floor(Math.random() * value.hits.length)].webformatURL;
            document.getElementById("trip_image").src = url;
            document.getElementById("trip_image").alt = target.getAttribute("data-city");
            console.log(url);
        });

    suggestionBox.innerHTML = "";
}

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

module.exports = {
    applyCity
}