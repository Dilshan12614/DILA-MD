import makeWASocket from "@whiskeysockets/baileys";
import fetch from "node-fetch";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

function extractCity(text = "") {
  // "weather Colombo" -> "Colombo"
  return text.replace(/^\s*weather\s+/i, "").trim();
}

// 1) city -> lat/lon (Geocoding)
async function geocodeCity(city, units = "metric") {
  const url =
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}` +
    `&limit=1&appid=${OPENWEATHER_API_KEY}&units=${units}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  if (!data?.length) return null;

  const best = data[0];
  return { lat: best.lat, lon: best.lon, name: best.name, country: best.country };
}

// 2) lat/lon -> Current weather
async function getCurrentWeather(lat, lon, units = "metric") {
  const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}` +
    `&appid=${OPENWEATHER_API_KEY}&units=${units}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather failed: ${res.status}`);
  return await res.json();
}

function formatWeather(w, location) {
  const temp = w.main?.temp;
  const feels = w.main?.feels_like;
  const desc = w.weather?.[0]?.description;
  const wind = w.wind?.speed;
  const humidity = w.main?.humidity;

  return [
    `📍 ${location}`,
    `🌡️ Temp: ${temp}°C`,
    `🤒 Feels like: ${feels}°C`,
    `📝 ${desc}`,
    `💧 Humidity: ${humidity}%`,
    `💨 Wind: ${wind} m/s`,
  ].join("
");
}

async function main() {
  const sock = makeWASocket({});

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key?.fromMe) return;

    const text =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      "";

    const city = extractCity(text);
    if (!city) return;

    try {
      const geo = await geocodeCity(city);
      if (!geo) {
        await sock.sendMessage(m.key.remoteJid, { text: `City not found: ${city}` });
        return;
      }

      const w = await getCurrentWeather(geo.lat, geo.lon);
      const reply = formatWeather(w, `${geo.name}${geo.country ? ", " + geo.country : ""}`);

      await sock.sendMessage(m.key.remoteJid, { text: reply });
    } catch (err) {
      await sock.sendMessage(m.key.remoteJid, { text: `Error: ${err.message}` });
    }
  });
}

main();
