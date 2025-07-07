import React, { useEffect, useState } from "react";

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
      className="flex items-center justify-center min-h-screen transition-colors duration-500"
      style={{ backgroundColor: bgColor }}
    >
      <div className="bg-white bg-opacity-80 shadow-lg rounded-xl p-8 w-full max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">🌤️ Weather Watch</h1>

        {loading && (
          <p className="text-gray-600 animate-pulse">Fetching your weather...</p>
        )}

        {error && (
          <p className="p-3 bg-red-100 text-red-600 rounded font-medium">{error}</p>
        )}

        {!loading && !error && (
          <>
            {icon && (
              <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={condition}
                className="mx-auto w-20 h-20"
              />
            )}
            <h2 className="text-2xl font-semibold text-gray-700">{city}</h2>
            <p className="text-xl text-gray-800">
              {temp}°C – {condition}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
              <div><span className="font-semibold">Humidity:</span> {humidity}%</div>
              <div><span className="font-semibold">Wind:</span> {wind} m/s</div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Refresh 🌐
            </button>
          </>
        )}

        <p className="text-xs text-gray-500 mt-6">The Weather Watch – glance & go 🌈</p>
      </div>
    </div>
  );
}

export default App;
