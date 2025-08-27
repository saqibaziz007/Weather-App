const API_KEY = "GNAme2qcoFHTiO2TtfdB1xGHyqsgMeRS";

function displayWeather(data, forecast, cityName) {
    document.getElementById("cityName").textContent = cityName;
    document.getElementById("datetime").textContent = new Date().toLocaleString();
    document.getElementById("forecast").textContent = data.WeatherText;
    document.getElementById("icon").src = `https://developer.accuweather.com/sites/default/files/${data.WeatherIcon.toString().padStart(2, '0')}-s.png`;
    document.getElementById("icon").alt = data.WeatherText;
    document.getElementById("temp").textContent = data.Temperature.Metric.Value + "°C";
    document.getElementById("minTemp").textContent = forecast.DailyForecasts[0].Temperature.Minimum.Value;
    document.getElementById("maxTemp").textContent = forecast.DailyForecasts[0].Temperature.Maximum.Value;
    document.getElementById("realFeel").textContent = data.RealFeelTemperature.Metric.Value + "°C";
    document.getElementById("humidity").textContent = data.RelativeHumidity + "%";
    document.getElementById("wind").textContent = data.Wind.Speed.Metric.Value + " km/h";
    document.getElementById("pressure").textContent = data.Pressure.Metric.Value + " mb";

    document.getElementById("weatherBody").style.display = "block";
    document.getElementById("weatherInfo").style.display = "flex";
}

function getWeather(event) {
    event.preventDefault();
    const city = document.getElementById("cityInput").value.trim();
    if (!city) return;

    fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${city}`)
        .then(res => res.json())
        .then(locationData => {
            if (!locationData.length) return;
            const key = locationData[0].Key;
            const cityName = locationData[0].LocalizedName + ", " + locationData[0].Country.LocalizedName;

            fetch(`https://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=${API_KEY}&details=true`)
                .then(res => res.json())
                .then(current => {
                    fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/1day/${key}?apikey=${API_KEY}&metric=true`)
                        .then(res => res.json())
                        .then(forecast => {
                            displayWeather(current[0], forecast, cityName);
                            localStorage.setItem("weatherCity", city);
                        });
                });
        });
}

// Load previous city on page refresh
window.onload = function () {
    const savedCity = localStorage.getItem("weatherCity");
    if (savedCity) {
        document.getElementById("cityInput").value = savedCity;
        document.querySelector(".fas.fa-search").click();
    }
};