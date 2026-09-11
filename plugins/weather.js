const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "weather",
    alias: ["wether", "climate"],
    desc: "🌤 Get weather information for a location",
    react: "🌤",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {

    try {

        if (!q) {
            return reply(
                "❗ *Please give me a city name* 🌍\n\n" +
                "📌 *Example:* `.weather Colombo`"
            );
        }

        const apiKey = '2d61a72574c11c4f36173b627f8cb177';
        const city = q.trim();

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        // Loading reaction
        await conn.sendMessage(from, {
            react: {
                text: '⏳',
                key: mek.key
            }
        });

        // Get weather data
        const response = await axios.get(url);
        const data = response.data;

        // Newsletter context
        const newsletterContext = {
            mentionedJid: [sender],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363429118791328@newsletter',
                newsletterName: '𝐃𝐈𝐋𝐀 𝐌𝐃',
                serverMessageId: Math.floor(Math.random() * 1000)
            }
        };

        // Weather message
        const weatherInfo = `
╭━━━〔 🌤️ 𝐖𝐄𝐀𝐓𝐇𝐄𝐑 〕━━━╮
┃
┃ 🌍 *Location:* ${data.name}, ${data.sys.country}
┃
┃ 🌡️ *Temperature:* ${data.main.temp}°C
┃ 🌡️ *Feels Like:* ${data.main.feels_like}°C
┃
┃ 📊 *Range:* ${data.main.temp_min}°C ~ ${data.main.temp_max}°C
┃ 💧 *Humidity:* ${data.main.humidity}%
┃ ☁️ *Condition:* ${data.weather[0].main}
┃ 📝 *Description:* ${data.weather[0].description}
┃ 💨 *Wind:* ${data.wind.speed} m/s
┃ 🔽 *Pressure:* ${data.main.pressure} hPa
┃
╰━━━━━━━━━━━━━━━━━━━━╯

> ⚡ *Powered by 𝐃𝐈𝐋𝐀 𝐌𝐃*
`;

        // Send weather image
        await conn.sendMessage(
            from,
            {
                image: {
                    url: "https://i.ibb.co/PS5DZdJ/Chat-GPT-Image-Mar-30-2025-12-53-39-PM.png"
                },
                caption: weatherInfo,
                contextInfo: newsletterContext
            },
            {
                quoted: mek
            }
        );

        // Success reaction
        await conn.sendMessage(from, {
            react: {
                text: '✅',
                key: mek.key
            }
        });

    } catch (e) {

        console.log("Weather Error:", e);

        // Error reaction
        await conn.sendMessage(from, {
            react: {
                text: '❌',
                key: mek.key
            }
        });

        if (e.response && e.response.status === 404) {
            return reply(
                "🚫 *City not found!*\n\n" +
                "📌 Try: `.weather Colombo`"
            );
        }

        if (e.response && e.response.status === 401) {
            return reply(
                "⚠️ *Weather API key is invalid.*"
            );
        }

        return reply(
            "⚠️ *Sorry, I couldn't get the weather information.* 😓"
        );
    }
});
