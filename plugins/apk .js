const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "apk",
    alias: ["app", "apkdl"],
    react: "📲",
    desc: "📥 Download APK Android Applications.",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply, sender }) => {
    try {
        // JID එක සඳහා ආරක්ෂිතව String අගයක් ලබා ගැනීම (Crashes වැළැක්වීමට)
        const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));

        if (!q) return reply("❌ *Please provide the app name!* ❌");

        // API එක මඟින් APK දත්ත ලබා ගැනීම
        const res = await fetch(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(q)}`);
        const data = await res.json();
        
        if (!data.success) return reply("❌ *Failed to fetch APK.* ❌");

        // DENETH-MD සඳහා සකස් කළ Newsletter Context සැකසුම්
        const newsletterContext = {
            mentionedJid: [sender],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363292876277898@newsletter',
                newsletterName: "𝐃𝐄𝐍𝐄𝐓𝐇-𝐌𝐃",
                serverMessageId: 143,
            },
        };

        let desc = `
╔══✦❘༻ *DENETH-MD* ༺❘✦══╗
┃ 📂 *App Name:*   ${data.apk_name} 
╰─━──━──━──━──━──━───━─╯
┃ 📥 *Download started...*
╰──━─════════════════⊷❍
*🔰 Powered by Deneth-MD* ⚡`;

        // App Thumbnail එක සමඟ විස්තර පත්‍රිකාව යැවීම
        await conn.sendMessage(
            targetJid, 
            { 
                image: { url: data.thumbnail }, 
                caption: desc,
                contextInfo: newsletterContext
            }, 
            { quoted: mek }
        );
        
        // වට්සැප් එකට Document එකක් ලෙස APK ගොනුව සෘජුවම යැවීම
        await conn.sendMessage(
            targetJid, 
            { 
                document: { url: data.download_link }, 
                mimetype: "application/vnd.android.package-archive", 
                fileName: `『 ${data.apk_name} 』.apk`, 
                caption: "✅ *APK Uploaded Successfully!* ✅\n🔰 *Powered by Deneth-MD* ⚡",
                contextInfo: newsletterContext
            }, 
            { quoted: mek }
        );
        
    } catch (e) {
        console.error(e);
        reply("❌ *An error occurred while fetching the APK.* ❌");
    }
});
