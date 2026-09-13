const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require('node-fetch');
const path = require('path');

// DENETH-MD සඳහා සකස් කළ Newsletter Context සැකසුම්
const newsletterContext = {
    mentionedJid: [], 
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363292876277898@newsletter',
        newsletterName: "𝐃𝐄𝐍𝐄𝐓𝐇-𝐌𝐃",
        serverMessageId: 143,
    }
};

// Error පණිවිඩ යැවීම පහසු කරන උපකාරක ශ්‍රිතය
function sendError(reply, message) {
    return reply(`*❌ ${message}*`);
}

// 1. VIDEO COMMAND (නම හෝ ලින්ක් එකෙන් වීඩියෝ සෙවීම සහ බාගත කිරීම)
cmd({
    pattern: "video",
    alias: ['ytdl', 'youtube', 'ytmp4dl'],
    react: "🎥",
    desc: "Download video from YouTube by prompt or URL.",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
    // JID එක සඳහා ආරක්ෂිතව String අගයක් ලබා ගැනීම (Crashes වැළැක්වීමට)
    const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));
    const retryLimit = 3;
    let attempt = 0;

    const fetchVideo = async () => {
        try {
            if (!q) return sendError(reply, "Please provide a video title or YouTube URL");

            let videoUrl = q;

            // ඇතුළත් කළේ ලින්ක් එකක් නොවේ නම් යූටියුබ් එකේ සෙවීම
            if (!q.includes('youtu')) {
                const search = await yts(q);
                const video = search.videos[0];
                if (!video) return sendError(reply, "No results found");
                videoUrl = video.url;
            }

            const messageContext = {
                ...newsletterContext,
                mentionedJid: [sender]
            };

            // API එක මඟින් වීඩියෝ දත්ත ලබා ගැනීම
            const apiUrl = `https://api.giftedtech.web.id/api/download/ytdl?apikey=gifted&url=${encodeURIComponent(videoUrl)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.success || !data.result) {
                return sendError(reply, "Failed to get video download info");
            }

            const { title, thumbnail, video_url, audi_quality, video_quality } = data.result;

            const infoMsg = `
╭═══════════════════⊷❍
│
│ *🎥 DENETH-MD VIDEO DL 🎥*
│───────────────────────
│ 📌 Title: ${title}
│ 🎞️ Quality: ${video_quality}
│ 🎧 Audio Quality: ${audi_quality}
╰──────────────────●●►
*📥 Downloaded via DENETH-MD* 🚀`.trim();

            // Thumbnail එක සමඟ විස්තර පත්‍රිකාව යැවීම
            await conn.sendMessage(targetJid, {
                image: { url: thumbnail },
                caption: infoMsg,
                contextInfo: messageContext
            }, { quoted: mek });

            // වට්සැප් එකට වීඩියෝවක් (Video File) ලෙස යැවීම
            await conn.sendMessage(targetJid, {
                video: { url: video_url },
                mimetype: 'video/mp4',
                caption: "*🎥 DENETH-MD*",
                contextInfo: messageContext
            }, { quoted: mek });

            // වට්සැප් එකට ලේඛනයක් (Document File) ලෙස යැවීම
            await conn.sendMessage(targetJid, {
                document: { url: video_url },
                mimetype: 'video/mp4',
                fileName: `${title}.mp4`,
                caption: "*📁 DENETH-MD*",
                contextInfo: messageContext
            }, { quoted: mek });

        } catch (error) {
            console.error('Video Error:', error);
            attempt++;
            if (attempt < retryLimit) {
                console.log(`Retrying... Attempt ${attempt + 1}`);
                await fetchVideo();
            } else {
                return sendError(reply, error.message);
            }
        }
    };

    await fetchVideo();
});


// 2. YTMP4 COMMAND (කෙලින්ම YouTube URL එකකින් පමණක් වීඩියෝ බාගත කිරීම)
cmd({
    pattern: "ytmp4",
    alias: ['youtube', 'ytvid'],
    react: "🎬",
    desc: "Download video from YouTube URL directly.",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
    const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));

    if (!q || (!q.includes("youtube.com") && !q.includes("youtu.be"))) {
        return sendError(reply, "Please provide a valid YouTube video URL");
    }

    try {
        const apiUrl = `https://api.giftedtech.web.id/api/download/ytdl?apikey=gifted&url=${encodeURIComponent(q)}`;
        const response = await fetch(apiUrl);
        const json = await response.json();

        if (!json.success || !json.result) {
            return sendError(reply, "Failed to retrieve video info");
        }

        const { title, thumbnail, video_url, audi_quality, video_quality } = json.result;

        const messageContext = {
            ...newsletterContext,
            mentionedJid: [sender]
        };

        const infoMsg = `
╭═══════════════════⊷❍
│
│ *🎥 YT Video Downloader 🎥*
│───────────────────────
│ 📌 Title: ${title}
│ 🎞️ Quality: ${video_quality}
│ 🎧 Audio Quality: ${audi_quality}
╰──────────────────●●►
*📥 Powered by DENETH-MD* 🚀`.trim();

        await conn.sendMessage(targetJid, {
            image: { url: thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

        // Video ලෙස යැවීම
        await conn.sendMessage(targetJid, {
            video: { url: video_url },
            mimetype: 'video/mp4',
            caption: "*🎥 DENETH-MD*",
            contextInfo: messageContext
            }, { quoted: mek });

        // Document ලෙස යැවීම
        await conn.sendMessage(targetJid, {
            document: { url: video_url },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: "*📁 DENETH-MD*",
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error("YTMP4 Error:", err);
        return sendError(reply, err.message);
    }
});
