import React, { useEffect, useState } from "react";
import "./App.css";

const weatherColors = {
  Clear: "#FFD700",
  Clouds: "#B0C4DE",
  Rain: "#4682B4",
  Drizzle: "#87CEFA",
  Thunderstorm: "#4B0082",
  Snow: "#FFFFFF",
  Mist: "#C0C0C0",
  Fog: "#A9A9A9",
  Haze: "#D3D3D3",
  Smoke: "#708090",
  Dust: "#F5DEB3",
  Sand: "#DEB887",
  Ash: "#BEBEBE",
  Squall: "#778899",
  Tornado: "#808080",
};

function App() {
  const [bgColor, setBgColor] = useState("#F0F0F0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [condition, setCondition] = useState("");
  const [temp, setTemp] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const [city, setCity] = useState("");
  const [icon, setIcon] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [forecast, setForecast] = useState([]);

  const apiKey = "c2276f08d6a94a0c6aae9010c9d3fabd";

  const fetchWeather = async (queryCity, lat, lon) => {
    try {
      const locationQuery = queryCity
        ? `q=${queryCity}`
        : `lat=${lat}&lon=${lon}`;
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${locationQuery}&units=metric&appid=${apiKey}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(`API error: ${data.message}`);
        setLoading(false);
        return;
      }

      if (data.weather && data.weather.length > 0) {
        const main = data.weather[0].main;
        setCondition(main);
        setTemp(data.main.temp);
        setHumidity(data.main.humidity);
        setWind(data.wind.speed);
        setCity(data.name);
        setIcon(data.weather[0].icon);
        setBgColor(weatherColors[main] || "#F0F0F0");
      } else {
        setError("Couldn't fetch weather data.");
      }

      // Fetch forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?${locationQuery}&units=metric&appid=${apiKey}`
      );
      const forecastData = await forecastRes.json();
      const daily = forecastData.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );
      setForecast(daily.slice(0, 5));
    } catch (e) {
      setError("Failed to fetch weather.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(null, latitude, longitude);
      },
      () => {
        setError("Could not get your location.");
        setLoading(false);
      }
    );
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setLoading(true);
      fetchWeather(searchCity);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen transition-colors duration-500 p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="glass-container p-6 rounded-2xl shadow-xl text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          The Weather Watch 🌤️
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 mb-6"
        >
          <input
            type="text"
            placeholder="Enter city"
            className="flex-1 px-4 py-2 rounded-full shadow-inner border border-gray-300 focus:outline-none"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            Search
          </button>
        </form>

        {loading ? (
          <p className="text-gray-700 text-lg font-medium">Loading weather...</p>
        ) : error ? (
          <div className="p-3 bg-red-200 text-red-800 rounded">{error}</div>
        ) : (
          <>
            <div className="mb-4">
              <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={condition}
                className="mx-auto"
              />
              <p className="text-xl font-semibold text-gray-700">
                {city} - {condition}
              </p>
              <p className="text-2xl font-bold">{temp}&deg;C</p>
              <div className="text-sm text-gray-600">
                💧 {humidity}% &nbsp; | &nbsp; 💨 {wind} m/s
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">5-Day Forecast</h2>
              <div className="grid grid-cols-5 gap-2 text-sm">
                {forecast.map((day, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-50 rounded-lg p-2 shadow"
                  >
                    <p>{new Date(day.dt_txt).toLocaleDateString("en-US", {
                      weekday: "short"
                    })}</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                      alt={day.weather[0].main}
                      className="w-8 mx-auto"
                    />
                    <p>{Math.round(day.main.temp)}&deg;C</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-600">
        the weather watch — check weather in a glance 🌈
      </div>
    </div>
  );
}

export default App;
