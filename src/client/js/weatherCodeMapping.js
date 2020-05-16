function getClassFromWeatherCode(weather_code) {
    let className;
    switch (weather_code) {
        case 200:
        case 201:
        case 202:
        case 203:
        case 231:
        case 232:
        case 233:
            className = "storm"
            break;
        case 300:
        case 301:
        case 302:
        case 500:
        case 501:
        case 502:
        case 511:
        case 520:
        case 521:
        case 522:
            className = "rain"
            break;
        case 600:
        case 601:
        case 602:
        case 610:
        case 611:
        case 612:
        case 621:
        case 622:
        case 623:
            className = "snow"
            break;
        case 700:
        case 711:
        case 741:
            className = "fog"
            break;
        case 721:
            className = "haze"
            break;
        case 731:
            className = "dust"
            break;
        case 800:
            className = "sun";
            break;
        case 801:
        case 802:
        case 803:
        case 804:
        case 900:
            className = "clouds";
            break;
        default:
            className = "sun";
    }
    return className;
}

module.exports = {
    getClassFromWeatherCode
}