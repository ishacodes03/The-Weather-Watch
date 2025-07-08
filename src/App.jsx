import React, { useEffect, useState } from "react";
import './App.css';

const weatherColors = {
  Clear: "rgba(255, 215, 0, 0.3)",         // Gold
  Clouds: "rgba(176, 196, 222, 0.3)",     // LightSteelBlue
  Rain: "rgba(70, 130, 180, 0.3)",        // SteelBlue
  Drizzle: "rgba(135, 206, 250, 0.3)",    // LightSkyBlue
  Thunderstorm: "rgba(75, 0, 130, 0.3)",  // Indigo
  Snow: "rgba(255, 255, 255, 0.3)",       // White
  Mist: "rgba(192, 192, 192, 0.3)",       // Silver
  Fog: "rgba(169, 169, 169, 0.3)",        // DarkGray
  Haze: "rgba(211, 211, 211, 0.3)",       // LightGray
  Smoke: "rgba(112, 128, 144, 0.3)",      // SlateGray
  Dust: "rgba(245, 222, 179, 0.3)",       // Wheat
  Sand: "rgba(222, 184, 135, 0.3)",       // BurlyWood
  Ash: "rgba(190, 190, 190, 0.3)",        // Gray
  Squall: "rgba(119, 136, 153, 0.3)",     // LightSlateGray
  Tornado: "rgba(128, 128, 128, 0.3)"      // Gray
};

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [condition, setCondition] = useState("");
  const [temp, setTemp] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const [city, setCity] = useState("");
  const [icon, setIcon] = useState("");
  const [glassColor, setGlassColor] = useState("rgba(255, 255, 255, 0.2)");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const apiKey = "c2276f08d6a94a0c6aae9010c9d3fabd";
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
            setGlassColor(weatherColors[main] || "rgba(255, 255, 255, 0.2)");
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
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url('https://source.unsplash.com/1600x900/?${condition}-weather')` }}
    >
      {loading && (
        <div className="text-xl text-gray-700 font-semibold">Loading weather...</div>
      )}

      {error && (
        <div className="p-4 bg-red-200 text-red-800 rounded">{error}</div>
      )}

      {!loading && !error && (
        <div
          className="glass text-white max-w-md w-full p-6 rounded-xl shadow-lg"
          style={{ backgroundColor: glassColor }}
        >
          <div className="text-3xl font-bold mb-2">Weather in {city}</div>
          <img
            className="w-20 h-20 mx-auto"
            src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={condition}
          />
          <p className="text-xl mt-2">Condition: {condition}</p>
          <p className="text-lg">Temperature: {temp}°C</p>
          <p className="text-lg">Humidity: {humidity}%</p>
          <p className="text-lg">Wind Speed: {wind} m/s</p>
        </div>
      )}

      <div className="fixed bottom-2 left-2 text-sm text-white">
        the weather watch — check weather in a glance import React, { useEffect, useState } from "react";
import './App.css';

const weatherColors = {
  Clear: "rgba(255, 215, 0, 0.3)",         // Gold
  Clouds: "rgba(176, 196, 222, 0.3)",     // LightSteelBlue
  Rain: "rgba(70, 130, 180, 0.3)",        // SteelBlue
  Drizzle: "rgba(135, 206, 250, 0.3)",    // LightSkyBlue
  Thunderstorm: "rgba(75, 0, 130, 0.3)",  // Indigo
  Snow: "rgba(255, 255, 255, 0.3)",       // White
  Mist: "rgba(192, 192, 192, 0.3)",       // Silver
  Fog: "rgba(169, 169, 169, 0.3)",        // DarkGray
  Haze: "rgba(211, 211, 211, 0.3)",       // LightGray
  Smoke: "rgba(112, 128, 144, 0.3)",      // SlateGray
  Dust: "rgba(245, 222, 179, 0.3)",       // Wheat
  Sand: "rgba(222, 184, 135, 0.3)",       // BurlyWood
  Ash: "rgba(190, 190, 190, 0.3)",        // Gray
  Squall: "rgba(119, 136, 153, 0.3)",     // LightSlateGray
  Tornado: "rgba(128, 128, 128, 0.3)"      // Gray
};

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [condition, setCondition] = useState("");
  const [temp, setTemp] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const [city, setCity] = useState("");
  const [icon, setIcon] = useState("");
  const [glassColor, setGlassColor] = useState("rgba(255, 255, 255, 0.2)");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const apiKey = "c2276f08d6a94a0c6aae9010c9d3fabd";
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
            setGlassColor(weatherColors[main] || "rgba(255, 255, 255, 0.2)");
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
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url('https://source.unsplash.com/1600x900/?${condition}-weather')` }}
    >
      {loading && (
        <div className="text-xl text-gray-700 font-semibold">Loading weather...</div>
      )}

      {error && (
        <div className="p-4 bg-red-200 text-red-800 rounded">{error}</div>
      )}

      {!loading && !error && (
        <div
          className="glass text-white max-w-md w-full p-6 rounded-xl shadow-lg"
          style={{ backgroundColor: glassColor }}
        >
          <div className="text-3xl font-bold mb-2">Weather in {city}</div>
          <img
            className="w-20 h-20 mx-auto"
            src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={condition}
          />
          <p className="text-xl mt-2">Condition: {condition}</p>
          <p className="text-lg">Temperature: {temp}°C</p>
          <p className="text-lg">Humidity: {humidity}%</p>
          <p className="text-lg">Wind Speed: {wind} m/s</p>
        </div>
      )}

      <div className="fixed bottom-2 left-2 text-sm text-white">
        the weather watch — check weather in a glance ☀️
      </div>
    </div>
  );
}

export default App;

