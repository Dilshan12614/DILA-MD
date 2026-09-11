const { cmd } = require('../command');
const os = require('os');

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    desc: "Check bot response speed",
    category: "main",
    react: "🏓",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {

    try {

        const start = Date.now();

        const newsletterJid = '120363429118791328@newsletter';
        const newsletterName = 'DILA MD';

        // First message
        const sent = await conn.sendMessage(from, {
            text: `⏳ *Checking speed...*`
        });

        const ping = Date.now() - start;

        // Final result
        await conn.sendMessage(from, {
            text:
`╭━━━〔 🏓 *DILA MD PING* 〕━━━╮
┃
┃ ⚡ *Speed:* ${ping} ms
┃ 🚀 *Status:* Online
┃ 📢 *Newsletter:* ${newsletterName}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: newsletterJid,
                    newsletterName: newsletterName
                }
            }
        });

        // Delete checking message
        try {
            await conn.sendMessage(from, {
                delete: sent.key
            });
        } catch (e) {}

    } catch (e) {
        console.log("Ping Error:", e);
        reply("❌ Ping error: " + e.message);
    }
});
