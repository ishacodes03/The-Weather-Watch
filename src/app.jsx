import React, { useEffect, useState } from "react";

const weatherColors = {
  Clear: "#FFD700",      // Gold
  Clouds: "#B0C4DE",     // LightSteelBlue
  Rain: "#4682B4",       // SteelBlue
  Drizzle: "#87CEFA",    // LightSkyBlue
  Thunderstorm: "#4B0082", // Indigo
  Snow: "#FFFFFF",       // White
  Mist: "#C0C0C0",       // Silver
  Fog: "#A9A9A9",        // DarkGray
  Haze: "#D3D3D3",       // LightGray
  Smoke: "#708090",      // SlateGray
  Dust: "#F5DEB3",       // Wheat
  Sand: "#DEB887",       // BurlyWood
  Ash: "#BEBEBE",        // Gray
  Squall: "#778899",     // LightSlateGray
  Tornado: "#808080",    // Gray
};

function App() {
  const [bgColor, setBgColor] = useState("#F0F0F0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [condition, setCondition] = useState("");

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
  setError(`API error: ${errData.message}`);
  setLoading(false);
  return;
}

          
          if (data.weather && data.weather.length > 0) {
            const main = data.weather[0].main;
            setCondition(main);
            setBgColor(weatherColors[main] || "#F0F0F0");
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
      className="flex flex-col items-center justify-center min-h-screen transition-colors duration-500"
      style={{ backgroundColor: bgColor }}
    >
      {loading && (
        <div className="text-xl text-gray-700 font-semibold">
          Loading weather...
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-200 text-red-800 rounded">
          {error}
        </div>
      )}
      {!loading && !error && (
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-70 rounded px-3 py-1 text-xs text-gray-700 shadow">
          {condition ? `Weather: ${condition}` : "Unknown weather"}
        </div>
      )}
      <div className="fixed bottom-2 left-2 text-xs text-gray-600">
        the weather watch — check weather in a glance 🌈
      </div>
    </div>
  );
}

export default App;