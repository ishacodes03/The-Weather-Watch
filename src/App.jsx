import React, { useEffect, useState } from "react";
import "./App.css";

const weatherImages = {
  Clear: "clear.png",
  Clouds: "clouds.jpg",
  Rain: "rain.jpg",
  Drizzle: "drizzle.png",
  Mist: "mist.jpg",
  Storm: "storm.png",
};

const weatherColors = {
  Clear: "bg-yellow-100/40",
  Clouds: "bg-blue-100/40",
  Rain: "bg-blue-300/40",
  Drizzle: "bg-cyan-100/40",
  Mist: "bg-gray-300/40",
  Storm: "bg-purple-300/40",
  Default: "bg-white/40",
};

function App() {
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);

  const apiKey = "c2276f08d6a94a0c6aae9010c9d3fabd";

  const fetchWeather = async (queryCity) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${queryCity}&units=metric&appid=${apiKey}`
      );
      const data = await res.json();
      if (res.ok) {
        setWeather(data);
        setCity(queryCity);
        setError("");
      } else {
        setError(data.message || "Couldn't fetch weather.");
        setWeather(null);
      }
    } catch (err) {
      setError("Failed to fetch weather.");
    }
    setLoading(false);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
          );
          const data = await res.json();
          if (res.ok) {
            setWeather(data);
            setCity(data.name);
            setError("");
          } else {
            setError("Failed to get location weather.");
          }
        } catch {
          setError("Failed to fetch weather.");
        }
        setLoading(false);
      },
      () => {
        setError("Location permission denied.");
        setLoading(false);
      }
    );
  }, []);

  const main = weather?.weather?.[0]?.main || "Default";
  const bgImage = `/` + (weatherImages[main] || "clear.png");
  const glassColor = weatherColors[main] || weatherColors.Default;

  return (
    <div
      className={`min-h-screen bg-cover bg-center transition-colors duration-500 ${
        dark ? "text-white" : "text-gray-900"
      }`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-1 rounded bg-white/40 backdrop-blur text-sm font-semibold shadow"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div
          className={`backdrop-blur-md rounded-xl shadow-xl p-6 max-w-sm w-full ${glassColor}`}
        >
          <h1 className="text-2xl font-bold mb-4 text-center">
            The Weather Watch 🌤️
          </h1>

          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Enter city"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow px-3 py-1 rounded-l bg-white/70 text-sm focus:outline-none"
            />
            <button
              onClick={() => fetchWeather(query)}
              className="px-3 bg-blue-500 text-white rounded-r"
            >
              Search
            </button>
          </div>

          {loading && <p className="text-center text-sm">Loading...</p>}
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          {weather && (
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">{city}</h2>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="icon"
                className="mx-auto"
              />
              <p className="text-lg">
                {weather.weather[0].main} — {weather.main.temp}°C
              </p>
              <p className="text-sm">
                Humidity: {weather.main.humidity}% | Wind:{" "}
                {weather.wind.speed} m/s
              </p>
            </div>
          )}
        </div>

        <div className="fixed bottom-2 left-2 text-xs text-white drop-shadow">
          made with ☁️ by you
        </div>
      </div>
    </div>
  );
}

export default App;
