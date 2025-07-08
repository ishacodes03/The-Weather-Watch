import React, { useEffect, useState } from "react";
import "./App.css";

const weatherBackgrounds = {
  Clear: "clear.jpg",
  Clouds: "clouds.jpg",
  Rain: "rain.jpg",
  Drizzle: "drizzle.jpg",
  Thunderstorm: "thunderstorm.jpg",
  Snow: "snow.jpg",
  Mist: "mist.jpg",
  Haze: "haze.jpg",
  Smoke: "smoke.jpg",
  Dust: "dust.jpg",
  Fog: "fog.jpg",
  Sand: "sand.jpg",
  Ash: "ash.jpg",
  Squall: "squall.jpg",
  Tornado: "tornado.jpg",
};

const App = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [bgImage, setBgImage] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const apiKey = "c2276f08d6a94a0c6aae9010c9d3fabd"; 

  const fetchWeather = async (city) => {
    try {
      setError("");
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      const weatherData = await weatherRes.json();

      if (!weatherRes.ok) throw new Error(weatherData.message);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );
      const forecastData = await forecastRes.json();

      setWeather(weatherData);
      setForecast(
        forecastData.list.filter((_, idx) => idx % 8 === 0).slice(0, 5)
      );
      setBgImage(weatherBackgrounds[weatherData.weather[0].main] || "default.jpg");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) fetchWeather(query.trim());
  };

  useEffect(() => {
    fetchWeather("Delhi"); // Default city
  }, []);

  return (
    <div
      className={`app-container ${darkMode ? "dark" : ""}`}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/${bgImage})`,
      }}
    >
      <div className="top-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            placeholder="Search city..."
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </form>
        <button onClick={() => setDarkMode((prev) => !prev)} className="toggle-btn">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {weather && (
        <div className="main-info glass">
          <h2>{weather.name}</h2>
          <h1>{Math.round(weather.main.temp)}°C</h1>
          <p>{weather.weather[0].main}</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast glass">
          {forecast.map((day, i) => (
            <div key={i} className="day">
              <p>{new Date(day.dt_txt).toLocaleDateString("en-IN", { weekday: "short" })}</p>
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].main}
              />
              <p>{Math.round(day.main.temp)}°C</p>
            </div>
          ))}
        </div>
      )}

      <footer>the weather watch —  glance & go ☀️ </footer>
    </div>
  );
};

export default App;
