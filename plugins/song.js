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

        await reply("🔎 Searching for your song...");

        // YouTube search
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

📌 *Title:* ${title}
⏱️ *Duration:* ${video.timestamp}
👤 *Channel:* ${video.author.name}

⬇️ Downloading audio...`
        );

        /*
         * Replace this API URL with your working
         * YouTube audio API if your current API changes.
         */
        const api = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`;

        const response = await axios.get(api);

        if (!response.data || !response.data.result) {
            return reply("❌ Audio download failed.");
        }

        const result = response.data.result;

        const audioUrl =
            result.download ||
            result.url ||
            result.download_url;

        if (!audioUrl) {
            return reply("❌ Audio URL එක ලැබුණේ නැහැ.");
        }

        await conn.sendMessage(from, {
            audio: {
                url: audioUrl
            },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
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
        }, {
            quoted: mek
        });

    } catch (error) {
        console.error("SONG PLUGIN ERROR:", error);
        return reply(
`❌ *Song Download Error*

${error.message || "Unknown error"}`
        );
    }
});
