const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

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
        // පද්ධතියේ විස්තර එකවර ලබා ගැනීම
        const uptime = runtime(process.uptime());
        const ram = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB`;
        const hostname = os.hostname();

        // ප්‍රධාන මැසේජ් එක ලස්සනට සකස් කිරීම
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

        // වට්සැප් නව බොත්තම් ක්‍රමවේදය (Native Flow Buttons)
        const buttons = [
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "📜 Main Menu",
                    id: ".menu"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "👤 Owner Info",
                    id: ".owner"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "⚡ Bot Speed",
                    id: ".ping"
                })
            }
        ];

        // මෙන්න බොත්තම් සහ ඉමේජ් එක එකතු කර මැසේජ් එක සාදන තැන
        const msg = generateWAMessageFromContent(from, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({
                            text: status
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({
                            text: "© Powered By Deneth MD"
                        }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            title: "DENETH-MD STATUS",
                            hasMediaAttachment: true,
                            imageMessage: { url: 'https://ibb.co' } // ඔයා එවපු Alive Image එක
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: buttons
                        }),
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
                    })
                }
            }
        }, { userJid: conn.user.id, quoted: mek });

        // මැසේජ් එක ක්ෂණිකව සෙන්ඩ් කිරීම
        await conn.relayMessage(from, msg.message, { messageId: msg.key.id });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
