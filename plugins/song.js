const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "song",
    alias: ["play", "ytmp3", "සින්දු"],
    desc: "యූටියුබ් සින්දු බාගත කර ගැනීම (YouTube Song Downloader).",
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
            return await conn.sendMessage(targetJid, { text: "⚠️ කරුණාකර සින්දුවක නමක් හෝ YouTube ලින්ක් එකක් ඇතුළත් කරන්න!\n\n*උදාහරණ:* `.song Malamin weela` හෝ `.song https://youtu.be...`" }, { quoted: mek });
        }

        const text = args.join(" ");
        
        // මුලින්ම සින්දුව සොයන බව පෙන්වීමට මැසේජ් එකක් යැවීම
        const loadingMsg = await conn.sendMessage(targetJid, { text: `🎵 *DENETH-MD Searching Your Song...* \n\`"${text}"\`` }, { quoted: mek });

        // යූටියුබ් සෙවුම් සහ ඩවුන්ලෝඩ් API එකක් භාවිතා කිරීම
        // පොදු API එකක් හරහා සින්දුවේ විස්තර සහ Audio ලින්ක් එක ලබා ගැනීම
        const searchUrl = `https://dreaded.site{encodeURIComponent(text)}` || `https://shizuka.xyz{encodeURIComponent(text)}`;
        const response = await axios.get(searchUrl);
        const resData = response.data;

        if (!resData || !resData.result) {
            return await conn.sendMessage(targetJid, { text: "❌ සින්දුව සොයා ගැනීමට නොහැකි වුණා. කරුණාකර නම වෙනස් කර නැවත උත්සාහ කරන්න.", edit: loadingMsg.key });
        }

        const song = resData.result;
        const title = song.title || "Audio File";
        const downloadUrl = song.downloadUrl || song.mp3 || song.dl_link;
        const thumbnail = song.thumb || song.thumbnail;

        // සින්දුව හමුවූ පසු මැසේජ් එක යාවත්කාලීන කිරීම
        await conn.sendMessage(targetJid, { text: `🎧 *DENETH-MD Downloading...*\n\n📌 *Title:* ${title}\n\n*කරුණාකර මොහොතක් රැඳී සිටින්න, සින්දුව Audio එකක් ලෙස එවනු ඇත.*` }, { edit: loadingMsg.key });

        // වට්සැප් එකට Audio File එකක් ලෙස සින්දුව යැවීම
        await conn.sendMessage(targetJid, { 
            audio: { url: downloadUrl }, 
            mimetype: 'audio/mp4', 
            fileName: `${title}.mp3` 
        }, { quoted: mek });

        // බාගත කිරීම සාර්ථක වූ පසු loading මැසේජ් එක මැකීම හෝ වෙනස් කිරීම
        await conn.sendMessage(targetJid, { text: `✅ *"${title}"* සාර්ථකව යවා අවසන්!` }, { edit: loadingMsg.key });

    } catch (e) {
        console.log("Song Command Error: ", e);
        const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));
        await conn.sendMessage(targetJid, { text: "❌ සින්දුව බාගත කිරීමේදී දෝෂයක් ඇති වුණා. සර්වර් එක කාර්යබහුල විය හැක. පසුව උත්සාහ කරන්න." }, { quoted: mek });
    }
});
