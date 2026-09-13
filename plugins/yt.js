const { cmd } = require('../command');
const yts = require('yt-search');

cmd({
    pattern: "song",
    alias: ['play', 'video', 'music'],
    react: "🎶",
    desc: "Search YouTube and download via number reply.",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));
    if (!q) return reply("*❌ Please provide a song title or YouTube URL*");

    try {
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("*❌ No results found*");

        // 1, 2, 3 ලෙස රිප්ලයි කිරීමට අවශ්‍ය විස්තර ලස්සනට පෙළගැස්වීම
        const infoMsg = `*🌤️ DENETH-MD DOWNLOAD CONTEXT 🌤️*

📌 *Title:* ${video.title}
⏱️ *Duration:* ${video.timestamp}
👁️ *Views:* ${video.views.toLocaleString()}
🔗 *URL:* ${video.url}

*Reply to this message with a number (1-3):*
1️⃣ | *Audio (MP3)* • 192kbps
2️⃣ | *Video (MP4)* • 360p/480p
3️⃣ | *Video (Document)* • MP4 File

> *Powered by DENETH-MD* 🚀`.trim();

        // Thumbnail එක සමඟ මැසේජ් එක චැට් එකට යැවීම
        await conn.sendMessage(targetJid, {
            image: { url: video.thumbnail },
            caption: infoMsg
        }, { quoted: mek });

    } catch (err) {
        console.error("Search Error:", err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});
