const { cmd } = require('../command');
const axios = require('axios');

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
        if (!q) {
            return reply("❌ YouTube link එකක් දෙන්න.\n\nExample:\n.song https://youtube.com/watch?v=xxxx");
        }

        if (!process.env.APIFY_TOKEN) {
            return reply("❌ APIFY_TOKEN GitHub Secrets වල නැහැ.");
        }

        await reply("⏳ Downloading song...\n\n🎵 Please wait...");

        const apiUrl =
            "https://api.apify.com/v2/acts/streamers~youtube-video-downloader/run-sync-get-dataset-items";

        const response = await axios.post(
            apiUrl,
            {
                videos: [
                    {
                        url: q
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

        if (!Array.isArray(data) || !data.length) {
            return reply("❌ Audio download result එකක් ලැබුණේ නැහැ.");
        }

        const result = data[0];

        const downloadUrl =
            result.downloadUrl ||
            result.url ||
            result.audioUrl ||
            result.videoUrl;

        if (!downloadUrl) {
            console.log("APIFY RESULT:", JSON.stringify(result, null, 2));
            return reply("❌ Download URL එක result එකේ නැහැ.");
        }

        const title = result.title || "DILA-MD Song";

        await conn.sendMessage(
            from,
            {
                audio: {
                    url: downloadUrl
                },
                mimetype: "audio/mpeg",
                fileName: `${title}.mp3`,
                ptt: false
            },
            {
                quoted: mek
            }
        );

    } catch (error) {

        console.error(
            "APIFY ERROR:",
            error.response?.data || error.message
        );

        return reply(
            "❌ Song download failed.\n\n" +
            "Reason: " +
            (error.response?.data?.error?.message || error.message)
        );
    }
});
