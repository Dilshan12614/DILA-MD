const { cmd } = require('../command');
const axios = require('axios');
const { cmd } = require('../command');
const axios = require('axios');

console.log("🔥 DILA-MD APIFY SONG PLUGIN LOADED");

cmd({
    pattern: "song",
    alias: ["mp3", "audio"],
    desc: "Download YouTube audio",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    try {

        // Check URL
        if (!q) {
            return reply(
                "❌ *YouTube link එකක් දෙන්න.*\n\n" +
                "📌 Example:\n" +
                ".song https://youtube.com/watch?v=xxxx"
            );
        }

        // Check Apify Token
        if (!process.env.APIFY_TOKEN) {
            return reply(
                "❌ *APIFY_TOKEN හම්බුණේ නැහැ.*\n\n" +
                "Railway → Variables වලට APIFY_TOKEN එක add කරලා Deploy කරන්න."
            );
        }

        // Check YouTube URL
        if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
            return reply("❌ කරුණාකර valid YouTube link එකක් දෙන්න.");
        }

        await reply(
            "⏳ *Downloading Song...*\n\n" +
            "🎵 Processing...\n" +
            "⌛ Please wait..."
        );

        const apiUrl =
            "https://api.apify.com/v2/acts/streamers~youtube-video-downloader/run-sync-get-dataset-items";

        const response = await axios.post(
            apiUrl,
            {
                videos: [
                    {
                        url: q.trim()
                    }
                ],

                storeInKVStore: true,
                preferredQuality: "720p",
                preferredFormat: "mp3",
                filenameTemplateParts: ["title"]
            },
            {
                params: {
                    token: process.env.APIFY_TOKEN
                },

                headers: {
                    "Content-Type": "application/json"
                },

                timeout: 300000
            }
        );

        const data = response.data;

        // No result
        if (!Array.isArray(data) || data.length === 0) {
            return reply(
                "❌ *Song download result එකක් ලැබුණේ නැහැ.*"
            );
        }

        const result = data[0];

        console.log(
            "APIFY RESULT:",
            JSON.stringify(result, null, 2)
        );

        // Find download URL
        const downloadUrl =
            result.downloadUrl ||
            result.audioUrl ||
            result.url ||
            result.videoUrl;

        if (!downloadUrl) {
            return reply(
                "❌ *Audio download link එක හම්බුණේ නැහැ.*\n\n" +
                "Apify result එක check කරන්න."
            );
        }

        const title =
            result.title ||
            result.name ||
            "DILA-MD Song";

        // Clean filename
        const safeTitle = title
            .replace(/[<>:"/\\|?*]/g, "")
            .substring(0, 100);

        // Send Audio
        await conn.sendMessage(
            from,
            {
                audio: {
                    url: downloadUrl
                },
                mimetype: "audio/mpeg",
                fileName: `${safeTitle}.mp3`,
                ptt: false
            },
            {
                quoted: mek
            }
        );

        console.log(
            `✅ Song sent successfully: ${safeTitle}`
        );

    } catch (error) {

        console.error(
            "❌ APIFY SONG ERROR:",
            error.response?.data || error.message
        );

        let reason =
            error.response?.data?.error?.message ||
            error.response?.data?.message ||
            error.message ||
            "Unknown error";

        return reply(
            "❌ *Song Download Failed*\n\n" +
            "⚠️ " + reason
        );
    }
});
