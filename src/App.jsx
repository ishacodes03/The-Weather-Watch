import React, { useEffect, useState } from "react";
import "./App.css";

const weatherImages = {
  Clear: "url('/clear.jpg')",
  Clouds: "url('/clouds.jpg')",
  Rain: "url('/rain.jpg')",
  Thunderstorm: "url('/storm.jpg')",
  Drizzle: "url('/drizzle.jpg')",
  Snow: "url('/snow.jpg')",
  Mist: "url('/mist.jpg')",
};

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const apiKey = "c2276f08d6a94a0c6aae9010c9d3fabd";
        const { latitude, longitude } = position.coords;

        // Current Weather
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );
        const data = await res.json();

        if (!res.ok) {
          setError(`API error: ${data.message}`);
          setLoading(false);
          return;
        }

        setWeather({
          city: data.name,
          temp: data.main.temp,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          condition: data.weather[0].main,
          icon: data.weather[0].icon,
          sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
          sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
        });

        // 5-Day Forecast
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );
        const forecastData = await forecastRes.json();

        const daily = forecastData.list.filter((_, i) => i % 8 === 0);
        setForecast(daily);
      } catch (e) {
        setError("Failed to fetch weather data.");
      }
      setLoading(false);
    });
  }, []);

  const backgroundImage = weatherImages[weather.condition] || "";

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white px-4"
      style={{ backgroundImage }}
    >
      {loading ? (
        <p className="text-xl font-semibold">Loading weather...</p>
      ) : error ? (
        <div className="p-4 bg-red-400/70 backdrop-blur-md rounded shadow">
          {error}
        </div>
      ) : (
        <div className="max-w-md w-full bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-2">📍 {weather.city}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="icon"
            />
            <div>
              <p className="text-4xl font-bold">{Math.round(weather.temp)}°C</p>
              <p className="capitalize">{weather.condition}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p>💧 Humidity: {weather.humidity}%</p>
            <p>💨 Wind: {weather.wind} m/s</p>
            <p>🌅 Sunrise: {weather.sunrise}</p>
            <p>🌇 Sunset: {weather.sunset}</p>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold mb-2">5-Day Forecast</h2>
            <div className="grid grid-cols-2 gap-4">
              {forecast.map((day) => (
                <div
                  key={day.dt}
                  className="bg-white/30 p-3 rounded-lg text-sm text-black"
                >
                  <p className="font-semibold">
                    {new Date(day.dt_txt).toLocaleDateString()}
                  </p>
                  <p>{day.weather[0].main}</p>
                  <p>{Math.round(day.main.temp)}°C</p>
                </div>
              ))}
            </div>
              );
}

export default App;
