const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require('node-fetch');

// DENETH-MD සඳහා සකස් කළ Newsletter Context සැකසුම්
const newsletterContext = {
    mentionedJid: [],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363292876277898@newsletter', // ඔබට අවශ්‍ය නම් මෙම JID එක වෙනස් කළ හැක
        newsletterName: "𝐃𝐄𝐍𝐄𝐓𝐇-𝐌𝐃",
        serverMessageId: 143,
    }
};

// 1. PLAY COMMAND (නම හෝ ලින්ක් එකෙන් සින්දු සෙවීම)
cmd({
    pattern: "play",
    alias: ['ytsong', 'song'],
    react: "🎵",
    desc: "Download audio from YouTube by name or URL.",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    // JID එක සඳහා ආරක්ෂිතව String අගයක් ලබා ගැනීම (Crashes වැළැක්වීමට)
    const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));

    if (!q) return reply("*❌ Please provide a song title or YouTube URL*");

    try {
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("*❌ No results found*");

        const messageContext = {
            ...newsletterContext,
            mentionedJid: [sender]
        };

        const infoMsg = `
╔═══〘 🎧 𝙈𝙋𝟛 𝘿𝙇 〙═══╗

⫸ 🎵 *Title:* ${video.title}
⫸ 👤 *Channel:* ${video.author.name}
⫸ ⏱️ *Duration:* ${video.timestamp}
⫸ 👁️ *Views:* ${video.views.toLocaleString()} views

╚══ ⸨ 𝐃𝐄𝐍𝐄𝐓𝐇-𝐌𝐃 ⸩ ═══╝`.trim();

        await conn.sendMessage(targetJid, {
            image: { url: video.thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

        // API භාවිතයෙන් ඩවුන්ලෝඩ් ලින්ක් එක ලබා ගැනීම
        const api = `https://itzpire.com/download/youtube/v2?url=${encodeURIComponent(video.url)}`;
        const res = await fetch(api);
        const json = await res.json();

        if (!json.status || json.status !== 'success' || !json.data?.downloadUrl) {
            return reply("*❌ Failed to get audio download link*");
        }

        const title = video.title;

        // වට්සැප් එකට Audio පණිවිඩයක් ලෙස යැවීම
        await conn.sendMessage(targetJid, {
            audio: { url: json.data.downloadUrl },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            ptt: false,
            contextInfo: messageContext
        }, { quoted: mek });

        // වට්සැප් එකට Document ගොනුවක් ලෙස යැවීම
        await conn.sendMessage(targetJid, {
            document: { url: json.data.downloadUrl },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            caption: "*📁 DENETH-MD*",
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error("Audio Error:", err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});

// 2. YTMP3 COMMAND (කෙලින්ම YouTube URL එකක් මඟින් සින්දු බාගත කිරීම)
cmd({
    pattern: "ytmp3",
    alias: ['yturlmp3'],
    react: "🎧",
    desc: "Download audio from a YouTube URL directly.",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));

    if (!q || (!q.includes("youtube.com") && !q.includes("youtu.be"))) {
        return reply("*❌ Please provide a valid YouTube video URL*");
    }

    try {
        const api = `https://itzpire.com/download/youtube/v2?url=${encodeURIComponent(q)}`;
        const res = await fetch(api);
        const data = await res.json();

        if (!data.status || !data.data?.downloadUrl) {
            return reply("*❌ Failed to retrieve MP3 link*");
        }

        const messageContext = {
            ...newsletterContext,
            mentionedJid: [sender]
        };

        const infoMsg = `
╔═━「 🎧 𝙔𝙏𝙈𝙋𝟛 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 」━═╗

⫸ 📌 *Title:* ${data.data.title}
⫸ 📁 *Format:* MP3
⫸ 🛰️ *Source:* YouTube

╚═━「 𝐃𝐄𝐍𝐄𝐓𝐇-𝐌𝐃 」━═╝
`.trim();

        await conn.sendMessage(targetJid, {
            image: { url: data.data.image || 'https://telegra.ph' },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

        // Audio ලෙස යැවීම
        await conn.sendMessage(targetJid, {
            audio: { url: data.data.downloadUrl },
            mimetype: 'audio/mp4',
            fileName: `${data.data.title}.mp3`,
            ptt: false,
            contextInfo: messageContext
        }, { quoted: mek });

        // Document ලෙස යැවීම
        await conn.sendMessage(targetJid, {
            document: { url: data.data.downloadUrl },
            mimetype: 'audio/mp4',
            fileName: `${data.data.title}.mp3`,
            caption: "*📁 DENETH-MD*",
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error("YTMP3 Error:", err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});

// 3. YTS COMMAND (යූටියුබ් වීඩියෝ තොරතුරු සෙවීම පමණක් සිදු කිරීම)
cmd({
    pattern: "yts",
    alias: ['ytsearch'],
    react: "🔍",
    desc: "Search YouTube for a video details.",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));

    if (!q) return reply("*❌ Please provide a song title or keywords for search*");

    try {
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("*❌ No results found*");

        const messageContext = {
            ...newsletterContext,
            mentionedJid: [sender]
        };

        const infoMsg = `
╔═━「 🔍 𝙔𝙏 𝙎𝙀𝘼𝙍𝘾𝐇 」━═╗

⫸ 📌 *Title:* ${video.title}
⫸ 👤 *Channel:* ${video.author.name}
⫸ ⏱️ *Duration:* ${video.timestamp}
⫸ 👁️ *Views:* ${video.views.toLocaleString()}
⫸ 🔗 *Link:* ${video.url}

╚═━「 💡 𝐃𝐄𝐍𝐄𝐓𝐇-𝐌𝐃 」━═╝`.trim();

        // ප්‍රතිඵල චැට් එකට යැවීම
        await conn.sendMessage(targetJid, {
            image: { url: video.thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error("YTB Search Error:", err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});
