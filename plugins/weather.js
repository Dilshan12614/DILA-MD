const { cmd } = require('../command');
const axios = require('axios');

// OpenWeather API Key
const API_KEY = '700f873bdc12c7f9a30469b3803611f9';

cmd({
    pattern: "weather",
    alias: ["climate", "temp"],
    desc: "Get current weather information",
    category: "main",
    react: "🌤️",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    try {

        if (!q) {
            return reply(
                `🌤️ *DILA-MD WEATHER*\n\n` +
                `Use:\n` +
                `.weather Colombo\n` +
                `.weather Negombo\n` +
                `.weather Kandy`
            );
        }

        const city = q.trim();

        // Get current weather
        const url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?q=${encodeURIComponent(city)}` +
            `&appid=${API_KEY}` +
            `&units=metric`;

        const response = await axios.get(url);
        const data = response.data;

        const name = data.name;
        const country = data.sys?.country || '';
        const temp = data.main?.temp;
        const feels = data.main?.feels_like;
        const humidity = data.main?.humidity;
        const pressure = data.main?.pressure;
        const wind = data.wind?.speed;
        const description = data.weather?.[0]?.description || 'Unknown';
        const visibility = data.visibility
            ? (data.visibility / 1000).toFixed(1)
            : 'N/A';

        const weatherEmoji = {
            'clear sky': '☀️',
            'few clouds': '🌤️',
            'scattered clouds': '⛅',
            'broken clouds': '☁️',
            'overcast clouds': '☁️',
            'light rain': '🌦️',
            'moderate rain': '🌧️',
            'heavy intensity rain': '🌧️',
            'thunderstorm': '⛈️',
            'snow': '❄️',
            'mist': '🌫️',
            'fog': '🌫️'
        };

        const emoji = weatherEmoji[description.toLowerCase()] || '🌤️';

        const text =
`╭━━━〔 🌤️ DILA-MD WEATHER 〕━━━╮
┃
┃ 📍 Location: ${name}, ${country}
┃ ${emoji} Condition: ${description}
┃ 🌡️ Temperature: ${temp}°C
┃ 🤒 Feels Like: ${feels}°C
┃ 💧 Humidity: ${humidity}%
┃ 💨 Wind: ${wind} m/s
┃ 🧭 Pressure: ${pressure} hPa
┃ 👁️ Visibility: ${visibility} km
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
> Powered by DILA-MD`;

        await conn.sendMessage(from, {
            text: text
        }, { quoted: mek });

    } catch (error) {

        if (error.response?.status === 404) {
            return reply(
                `❌ *City Not Found!*\n\n` +
                `Example:\n` +
                `.weather Colombo`
            );
        }

        if (error.response?.status === 401) {
            return reply(
                `❌ *OpenWeather API Key Error!*\n\n` +
                `Please check your API key.`
            );
        }

        console.log('Weather Error:', error.message);

        return reply(
            `❌ *Weather Error!*\n\n` +
            `Please try again later.`
        );
    }
});
