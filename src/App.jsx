import React, { useEffect, useState } from "react";
import "./App.css";

const weatherColors = {
  Clear: "bg-yellow-300/30",
  Clouds: "bg-blue-200/30",
  Rain: "bg-blue-400/30",
  Drizzle: "bg-blue-300/30",
  Thunderstorm: "bg-indigo-700/30",
  Snow: "bg-white/30",
  Mist: "bg-gray-300/30",
  Fog: "bg-gray-500/30",
  Haze: "bg-gray-200/30",
  Smoke: "bg-gray-400/30",
  Dust: "bg-yellow-100/30",
  Sand: "bg-yellow-200/30",
  Ash: "bg-gray-400/30",
  Squall: "bg-gray-600/30",
  Tornado: "bg-gray-700/30",
};

function App() {
  const [bgColor, setBgColor] = useState("bg-gray-100");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [condition, setCondition] = useState("");
  const [temp, setTemp] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const [city, setCity] = useState("");
  const [icon, setIcon] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const apiKey = "c2276f08d6a94a0c6aae9010c9d3fabd"; // your key
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
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
            setBgColor(weatherColors[main] || "bg-gray-100");
          } else {
            setError("Couldn't fetch weather data.");
          }
        } catch (e) {
          setError("Failed to fetch weather.");
        }
        setLoading(false);
      },
      () => {
        setError("Could not get your location.");
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className={`flex items-center justify-center min-h-screen ${bgColor} transition-all duration-500`}>
      {loading && (
        <div className="text-xl text-gray-800 font-semibold">Loading weather...</div>
      )}
      {error && (
        <div className="p-4 bg-red-200 text-red-800 rounded">{error}</div>
      )}
      {!loading && !error && (
        <div className={`glass p-8 rounded-3xl shadow-xl text-center text-white max-w-sm w-full ${bgColor}`}>
          <h1 className="text-2xl font-bold mb-2">{city}</h1>
          {icon && (
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt="Weather Icon"
              className="mx-auto mb-2"
            />
          )}
          <p className="text-xl font-semibold mb-1">{condition}</p>
          <p className="text-lg">🌡 Temp: {temp}°C</p>
          <p className="text-lg">💧 Humidity: {humidity}%</p>
          <p className="text-lg">🌬 Wind: {wind} m/s</p>
        </div>
      )}
      <div className="fixed bottom-2 left-2 text-xs text-gray-700 bg-white/70 px-2 py-1 rounded">
        the weather watch — glance & go 🌈
      </div>
    </div>
  );
}

export default App;
