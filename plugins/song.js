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

        // YouTube MP3 conversion
        const response = await axios.post(
            "https://ytmp3.ge/api/convert",
            new URLSearchParams({
                youtube_url: url,
                quality: "192"
            }).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                timeout: 120000
            }
        );

        const data = response.data;

        console.log("YTMP3 API RESPONSE:", data);

        if (!data || data.success !== true) {
            throw new Error(
                data?.error || "YouTube conversion failed"
            );
        }

        const audioUrl = data.downloadUrl;

        if (!audioUrl) {
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
