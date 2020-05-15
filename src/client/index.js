import "core-js/stable";
import "regenerator-runtime/runtime";

import "./js/httpRequest";
import "./js/weatherCodeMapping";
import "./js/app";

import "./styles/global.scss";
import "./styles/main.scss";
import "./styles/content.scss";
import "./styles/weather_forecast.scss";

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));