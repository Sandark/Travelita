import "core-js/stable";
import "regenerator-runtime/runtime";

import "./js/httpRequest";
import "./js/weatherCodeMapping";
import "./js/dateUtils"
import "./js/entryView"
import "./js/entryController"
import "./js/app";

import "./styles/global.scss";
import "./styles/main.scss";
import "./styles/content.scss";
import "./styles/weather_forecast.scss";
import "./styles/package_items.scss";

/* import all images from img folder*/
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));