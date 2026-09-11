const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "song",
    alias: ["play", "music"],
    desc: "Download YouTube song as audio",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, {
    from,
    q,
    reply
}) => {
    try {
        if (!q) {
            return reply(
`🎵 *DILA-MD SONG*

Usage:
.song <song name>

Example:
.song Alan Walker Faded`
            );
        }

        await reply("🔎 *Searching for your song...*");

        const search = await yts(q);

        if (!search.videos || search.videos.length === 0) {
            return reply("❌ Song එක හොයාගන්න බැරි වුණා.");
        }

        const video = search.videos[0];

        const title = video.title;
        const url = video.url;
        const thumbnail = video.thumbnail;

        await reply(
`🎵 *DILA-MD SONG*

╭━━━━━━━━━━━━━━━━━━╮
┃ 🎶 *TITLE:* ${title}
┃ ⏱️ *DURATION:* ${video.timestamp}
┃ 👤 *CHANNEL:* ${video.author.name}
╰━━━━━━━━━━━━━━━━━━╯

⬇️ *Downloading audio...*`
        );

        /*
         * YouTube Audio API
         * Vreden API removed
         */

        const apiUrl =
            `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(url)}`;

        const response = await axios.get(apiUrl, {
            timeout: 60000
        });

        const data = response.data;

        if (!data) {
            throw new Error("API returned empty response");
        }

        const audioUrl =
            data.url ||
            data.downloadUrl ||
            data.download ||
            data.result?.url ||
            data.result?.download ||
            data.result?.download_url;

        if (!audioUrl) {
            console.log("API RESPONSE:", data);
            throw new Error("Audio download URL not found");
        }

        await conn.sendMessage(
            from,
            {
                audio: {
                    url: audioUrl
                },
                mimetype: "audio/mpeg",
                fileName: `${title.replace(/[\\/:*?"<>|]/g, '')}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        title: title,
                        body: "🎵 DILA-MD",
                        thumbnailUrl: thumbnail,
                        sourceUrl: url,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            },
            {
                quoted: mek
            }
        );

    } catch (error) {
        console.error("SONG PLUGIN ERROR:", error);

        return reply(
`❌ *Song Download Error*

⚠️ ${error.message || "Unknown error"}

💡 Try another song or try again later.`
        );
    }
});
