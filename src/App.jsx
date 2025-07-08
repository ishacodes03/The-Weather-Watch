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
  const [bgImage, setBgImage] = useState("");
  const [condition, setCondition] = useState("");
  const [temp, setTemp] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const [city, setCity] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

            // Background image logic
            let imageFile = "default.jpg";
            if (main === "Clear") imageFile = "clear.jpg";
            else if (main === "Clouds") imageFile = "clouds.jpg";
            else if (main === "Rain") imageFile = "rain.jpg";
            else if (main === "Thunderstorm") imageFile = "storm.jpg";
            else if (main === "Drizzle") imageFile = "drizzle.jpg";
            else if (main === "Snow") imageFile = "snow.jpg";
            else if (["Mist", "Fog", "Haze"].includes(main)) imageFile = "mist.jpg";

            setBgImage(`/${imageFile}`);
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
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {loading ? (
        <div className="text-xl text-white font-semibold">Loading weather...</div>
      ) : error ? (
        <div className="p-4 bg-red-300 text-red-900 rounded-lg shadow">{error}</div>
      ) : (
        <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-center text-white w-[90%] max-w-sm">
          <h2 className="text-2xl font-bold mb-2">{city}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={condition}
            className="mx-auto"
          />
          <p className="text-xl font-semibold">{condition}</p>
          <p className="text-lg">🌡 Temp: {temp}°C</p>
          <p className="text-lg">💧 Humidity: {humidity}%</p>
          <p className="text-lg">💨 Wind: {wind} m/s</p>
        </div>
      )}

      <div className="fixed bottom-2 left-2 text-xs text-white drop-shadow">
        the weather watch — check weather in a glance 🌈
      </div>
    </div>
  );
}

export default App;

