const form = document.getElementById("form");
const cityInput = document.getElementById("city");
const submitBtn = document.getElementById("submitBtn");
const errorEl = document.getElementById("error");
const body = document.getElementById("body");

const resultContainer = document.getElementById("result");
const tempResult = document.getElementById("temp");
const feelsLikeResult = document.getElementById("feelslike");
const MaxtempResult = document.getElementById("maxtemp");
const MintempResult = document.getElementById("mintemp");
const PressureResult = document.getElementById("pressure");
const HumidityResult = document.getElementById("humidity");
const NameResult = document.getElementById("name");
const descriptResult = document.getElementById("desc");
const WindResult = document.getElementById("wind");
const SunriseResult = document.getElementById("sunrise");
const SunsetResult = document.getElementById("sunset");

const LonResult = document.getElementById("lon");
const LatResult = document.getElementById("lat");
const CountryResult = document.getElementById("country");
const MainResult = document.getElementById("main");
const iconEl = document.getElementById("icon");

// NOTE: For a production app, keep this key on a backend proxy instead of
// shipping it in client-side JS.
const apikey = "717fca7b7145785f731448249df7b7e9";

const WEATHER_CLASS_MAP = {
    Clear: "weather-clear",
    Clouds: "weather-clouds",
    Rain: "weather-rain",
    Drizzle: "weather-drizzle",
    Thunderstorm: "weather-thunderstorm",
    Snow: "weather-snow",
    Mist: "weather-mist",
    Fog: "weather-fog",
    Haze: "weather-haze",
};

function clearWeatherEffects() {
    body.classList.remove("show-rain", "show-snow");
    document.querySelectorAll(".weather-fx").forEach((el) => el.remove());
}

function spawnParticles(type, count) {
    const container = document.createElement("div");
    container.className = `weather-fx ${type}`;
    for (let i = 0; i < count; i++) {
        const span = document.createElement("span");
        span.style.left = `${Math.random() * 100}%`;
        span.style.animationDuration = `${0.6 + Math.random() * 1}s`;
        span.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(span);
    }
    body.appendChild(container);
}

function applyWeatherTheme(weatherMain, isNight) {
    // Reset all weather classes first
    Object.values(WEATHER_CLASS_MAP).forEach((cls) => body.classList.remove(cls));
    body.classList.remove("weather-night");
    clearWeatherEffects();

    if (isNight && weatherMain === "Clear") {
        body.classList.add("weather-night");
    } else if (WEATHER_CLASS_MAP[weatherMain]) {
        body.classList.add(WEATHER_CLASS_MAP[weatherMain]);
    }

    if (weatherMain === "Rain" || weatherMain === "Drizzle") {
        body.classList.add("show-rain");
        spawnParticles("rain", 40);
    } else if (weatherMain === "Thunderstorm") {
        body.classList.add("show-rain");
        spawnParticles("rain", 60);
    } else if (weatherMain === "Snow") {
        body.classList.add("show-snow");
        spawnParticles("snow", 40);
    }
}

function formatLocalTime(unixSeconds, timezoneOffsetSeconds) {
    // API gives UTC unix time + city's UTC offset in seconds
    const localMillis = (unixSeconds + timezoneOffsetSeconds) * 1000;
    const date = new Date(localMillis);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorEl.textContent = "";

    const city = cityInput.value.trim();
    if (!city) {
        errorEl.textContent = "Please enter a city name.";
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apikey}&units=metric`;

    submitBtn.disabled = true;
    submitBtn.textContent = "Checking...";

    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            if (result.cod !== 200) {
                throw new Error(result.message || "City not found");
            }

            const temp = result.main.temp;
            const feelsLike = result.main.feels_like;
            const description = result.weather[0].description;
            const maxTemp = result.main.temp_max;
            const minTemp = result.main.temp_min;
            const cityName = result.name;
            const pressure = result.main.pressure;
            const humidity = result.main.humidity;

            const lat = result.coord.lat;
            const lon = result.coord.lon;
            const country = result.sys.country;
            const main = result.weather[0].main;
            const icon = result.weather[0].icon;
            const windSpeed = result.wind.speed;
            const timezoneOffset = result.timezone;
            const sunrise = formatLocalTime(result.sys.sunrise, timezoneOffset);
            const sunset = formatLocalTime(result.sys.sunset, timezoneOffset);

            const nowUtcSeconds = Math.floor(Date.now() / 1000);
            const isNight = nowUtcSeconds < result.sys.sunrise || nowUtcSeconds > result.sys.sunset;

            tempResult.textContent = temp.toFixed(1);
            feelsLikeResult.textContent = `${feelsLike.toFixed(1)} °C`;
            MaxtempResult.textContent = `${maxTemp.toFixed(1)} °C`;
            MintempResult.textContent = `${minTemp.toFixed(1)} °C`;
            NameResult.textContent = cityName;
            PressureResult.textContent = `${pressure} hPa`;
            HumidityResult.textContent = `${humidity}%`;

            LatResult.textContent = lat;
            LonResult.textContent = lon;
            CountryResult.textContent = country;
            MainResult.textContent = main;
            WindResult.textContent = `${windSpeed} m/s`;
            SunriseResult.textContent = sunrise;
            SunsetResult.textContent = sunset;

            iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            iconEl.alt = description;

            descriptResult.textContent = description;
            resultContainer.style.display = "flex";

            applyWeatherTheme(main, isNight);
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
            errorEl.textContent = "City not found. Please check the spelling and try again.";
            resultContainer.style.display = "none";
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Check weather condition";
        });
});