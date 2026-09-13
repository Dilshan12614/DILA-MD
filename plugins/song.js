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
        // JID අගය String එකක් බවට තහවුරු කර ගැනීම
        const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));
        
        // පරිශීලකයා ඇතුළත් කළ සින්දුවේ නම හෝ ලින්ක් එක ලබා ගැනීම
        const args = options.args;
        if (!args || args.length === 0) {
            return await conn.sendMessage(targetJid, { 
                text: "⚠️ Please provide a song name or a YouTube link!\n\n*Example:* `.song Lelena` or `.song https://youtu.be...`" 
            }, { quoted: mek });
        }

        const text = args.join(" ");
        
        // සින්දුව සොයන බව පෙන්වීමට ඉංග්‍රීසි මැසේජ් එකක් යැවීම
        const loadingMsg = await conn.sendMessage(targetJid, { 
            text: `🎵 *DENETH-MD Searching Your Song...*\n\`"${text}"\`` 
        }, { quoted: mek });

        // වඩාත් ස්ථාවර නව පොදු API එකක් හරහා යූටියුබ් දත්ත ලබා ගැනීම
        const searchUrl = `https://dreaded.site{encodeURIComponent(text)}`;
        const fallbackUrl = `https://giftedtech.my.id{encodeURIComponent(text)}`;
        
        let resData;
        try {
            // පළමු API එක උත්සාහ කිරීම
            const response = await axios.get(searchUrl);
            resData = response.data;
        } catch (apiErr) {
            // පළමු API එක වැඩ නොකළහොත් දෙවන ස්ථාවර API එක උත්සාහ කිරීම
            const response = await axios.get(`https://giftedtech.my.id{encodeURIComponent(text)}`);
            if (response.data && response.data.results && response.data.results.length > 0) {
                const videoUrl = response.data.results[0].url;
                const dlResponse = await axios.get(`https://giftedtech.my.id{encodeURIComponent(videoUrl)}`);
                resData = dlResponse.data;
            }
        }

        // දත්ත ලැබී ඇත්දැයි පරීක්ෂා කිරීම (නව API රටාවට අනුව)
        if (!resData || (!resData.result && !resData.data)) {
            return await conn.sendMessage(targetJid, { 
                text: "❌ Song not found! Please check the name or link and try again.", 
                edit: loadingMsg.key 
            });
        }

        // ලැබුණු දත්ත වෙන් කර ගැනීම
        const song = resData.result || resData.data;
        const title = song.title || "Audio File";
        const downloadUrl = song.downloadUrl || song.download_url || song.mp3 || song.url;

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

        // බාගත කිරීම සාර්ථක වූ පසු මැසේජ් එක යාවත්කාලීන කිරීම
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
