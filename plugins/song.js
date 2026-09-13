const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "song",
    alias: ["play", "ytmp3", "music"],
    desc: "Download YouTube songs as MP3 audio.",
    category: "download",
    filename: __filename
},
async (conn, mek, from, options) => {
    try {
        // JID අගය String එකක් බවට ස්ථිර කර ගැනීම (Crashes වැළැක්වීමට)
        const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));
        
        // පරිශීලකයා ඇතුළත් කළ සින්දුවේ නම හෝ YouTube ලින්ක් එක ලබා ගැනීම
        const args = options.args;
        if (!args || args.length === 0) {
            return await conn.sendMessage(targetJid, { 
                text: "⚠️ Please provide a song name or a YouTube link!\n\n*Example:* `.song Malamin weela` or `.song https://youtu.be...`" 
            }, { quoted: mek });
        }

        const text = args.join(" ");
        
        // සින්දුව සොයන බව පෙන්වීමට ඉංග්‍රීසි මැසේජ් එකක් යැවීම
        const loadingMsg = await conn.sendMessage(targetJid, { 
            text: `🎵 *DENETH-MD Searching Your Song...*\n\`"${text}"\`` 
        }, { quoted: mek });

        // පොදු සහ නොමිලේ භාවිතා කළ හැකි යූටියුබ් API එකක් හරහා දත්ත ලබා ගැනීම
        const searchUrl = `https://dreaded.site{encodeURIComponent(text)}`;
        const response = await axios.get(searchUrl);
        const resData = response.data;

        if (!resData || !resData.result) {
            return await conn.sendMessage(targetJid, { 
                text: "❌ Song not found! Please check the name or link and try again.", 
                edit: loadingMsg.key 
            });
        }

        const song = resData.result;
        const title = song.title || "Audio File";
        const downloadUrl = song.downloadUrl || song.mp3 || song.dl_link;

        // සින්දුව ඩවුන්ලෝඩ් වන බව පෙන්වීමට මැසේජ් එක Edit කිරීම
        await conn.sendMessage(targetJid, { 
            text: `🎧 *DENETH-MD Downloading...*\n\n📌 *Title:* ${title}\n\n*Please wait a moment, sending your audio file.*` 
        }, { edit: loadingMsg.key });

        // වට්සැප් එකට Audio File එකක් ලෙස සින්දුව යැවීම
        await conn.sendMessage(targetJid, { 
            audio: { url: downloadUrl }, 
            mimetype: 'audio/mp4', 
            fileName: `${title}.mp3` 
        }, { quoted: mek });

        // බාගත කිරීම සාර්ථක වූ පසු මැසේජ් එක අවසන් වරට යාවත්කාලීන කිරීම
        await conn.sendMessage(targetJid, { 
            text: `✅ *"${title}"* successfully delivered!` 
        }, { edit: loadingMsg.key });

    } catch (e) {
        console.log("Song Command Error: ", e);
        const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));
        await conn.sendMessage(targetJid, { 
            text: "❌ An error occurred while downloading the song. The server might be busy. Please try again later." 
        }, { quoted: mek });
    }
});
