import React, { useEffect, useState } from "react";
import './App.css';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [condition, setCondition] = useState("");
  const [temp, setTemp] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const [city, setCity] = useState("");
  const [icon, setIcon] = useState("");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const fetchWeather = async (query) => {
    setLoading(true);
    try {
      const apiKey = "c2276f08d6a94a0c6aae9010c9d3fabd";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`
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
        setHistory((prev) => [data.name, ...prev.filter((c) => c !== data.name)].slice(0, 5));
        setError("");
      } else {
        setError("Couldn't fetch weather data.");
      }
    } catch (e) {
      setError("Failed to fetch weather.");
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      fetchWeather(input.trim());
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-500 px-4 ${darkMode ? "bg-gray-900 text-white" : "text-gray-800"}`}
      style={{ backgroundColor: darkMode ? "#1a1a1a" : bgColor }}
    >
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 px-3 py-1 bg-white/80 dark:bg-gray-800 text-sm rounded shadow"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"} Mode
      </button>

      <form onSubmit={handleSearch} className="mb-6 w-full max-w-sm flex gap-2">
        <input
          type="text"
          placeholder="Search city..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow px-3 py-2 rounded shadow focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {loading && <div className="text-xl font-semibold">Loading weather...</div>}

      {error && <div className="p-4 bg-red-200 text-red-800 rounded">{error}</div>}

      {!loading && !error && condition && (
        <div className="bg-white/60 dark:bg-gray-800/70 p-6 rounded-xl shadow-lg text-center backdrop-blur-md">
          <h1 className="text-2xl font-bold mb-2">{city}</h1>
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={condition}
            className="mx-auto"
          />
          <p className="text-lg font-medium">{condition}</p>
          <p>🌡️ {temp}°C</p>
          <p>💧 Humidity: {humidity}%</p>
          <p>💨 Wind: {wind} m/s</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6 text-sm text-gray-700 dark:text-gray-300">
          <h2 className="font-semibold mb-1">Recent Searches:</h2>
          <div className="flex gap-2 flex-wrap">
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => fetchWeather(h)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-2 left-2 text-xs opacity-60">
        the weather watch — check weather in a glance☀️
      </div>
    </div>
  );
}

export default App;

