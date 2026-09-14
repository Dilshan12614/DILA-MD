const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "alive",
    alias: ["status", "runtime", "uptime"],
    desc: "Check uptime and system status",
    category: "main",
    react: "🧚‍♂️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const uptime = runtime(process.uptime());
        const ram = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB`;
        const hostname = os.hostname();

        const status = `👋 *HELLO ${pushname} I AM ALIVE NOW*

╭━━〔 *DENETH-MD* 〕━━┈⊷
┃◈╭────────────
┃◈┃• *⏳ Uptime*: ${uptime}
┃◈┃• *📟 Ram usage*: ${ram}
┃◈┃• *⚙️ HostName*: ${hostname}
┃◈┃• *👨‍💻 Owner*: DENETH MD
┃◈┃• *🧬 Version*: 3.0.0 BETA
┃◈└───────────
╰──────────────`;

        // 100% ක්ම වැඩ කරන නිල වට්සැප් Template Buttons ක්‍රමය
        const templateButtons = [
            { index: 1, quickReplyButton: { displayText: '📜 Main Menu', id: '.menu' } },
            { index: 2, quickReplyButton: { displayText: '👤 Owner Info', id: '.owner' } },
            { index: 3, quickReplyButton: { displayText: '⚡ Bot Speed', id: '.ping' } }
        ];

        // ඉමේජ් එකයි, ටෙක්ස්ට් එකයි, බටන්සුයි එකවර යැවීම
        await conn.sendMessage(from, {
            image: { url: `https://ibb.co` }, // ඔයා එවපු Alive Image එක
            caption: status,
            footer: "© Powered By Deneth MD",
            templateButtons: templateButtons,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363429118791328@newsletter',
                    newsletterName: 'DENETH MD',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
