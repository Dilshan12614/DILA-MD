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

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STEP 1 - START LOADING
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        const loading = await conn.sendMessage(from, {
            text: `╭━━〔 *DENETH-MD* 〕━━┈⊷
┃
┃  ⏳ *Loading System...*
┃
┃  ▱▱▱▱▱▱▱▱▱▱ 0%
┃
┃  Please wait...
┃
╰━━━━━━━━━━━━━━━━━━━`
        }, { quoted: mek });

        await new Promise(resolve => setTimeout(resolve, 1000));

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STEP 2 - UPTIME
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        await conn.sendMessage(from, {
            text: `╭━━〔 *DENETH-MD* 〕━━┈⊷
┃
┃  ⏳ *Loading Uptime...*
┃
┃  ▰▰▱▱▱▱▱▱▱▱ 20%
┃
┃  • Uptime: Loading...
┃
╰━━━━━━━━━━━━━━━━━━━`,
            edit: loading.key
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        const uptime = runtime(process.uptime());

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STEP 3 - RAM
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        await conn.sendMessage(from, {
            text: `╭━━〔 *DENETH-MD* 〕━━┈⊷
┃
┃  📟 *Loading RAM Usage...*
┃
┃  ▰▰▰▰▱▱▱▱▱▱ 40%
┃
┃  • Uptime: ${uptime}
┃  • RAM: Loading...
┃
╰━━━━━━━━━━━━━━━━━━━`,
            edit: loading.key
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        const ram = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB`;

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STEP 4 - HOSTNAME
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        await conn.sendMessage(from, {
            text: `╭━━〔 *DENETH-MD* 〕━━┈⊷
┃
┃  ⚙️ *Loading HostName...*
┃
┃  ▰▰▰▰▰▰▱▱▱▱ 60%
┃
┃  • Uptime: ${uptime}
┃  • RAM: ${ram}
┃  • HostName: Loading...
┃
╰━━━━━━━━━━━━━━━━━━━`,
            edit: loading.key
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        const hostname = os.hostname();

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STEP 5 - OWNER
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        await conn.sendMessage(from, {
            text: `╭━━〔 *DENETH-MD* 〕━━┈⊷
┃
┃  👨‍💻 *Loading Owner...*
┃
┃  ▰▰▰▰▰▰▰▰▱▱ 80%
┃
┃  • Uptime: ${uptime}
┃  • RAM: ${ram}
┃  • HostName: ${hostname}
┃  • Owner: Loading...
┃
╰━━━━━━━━━━━━━━━━━━━`,
            edit: loading.key
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STEP 6 - FINAL TEXT
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STEP 7 - NEW TEMPLATE BUTTONS METHOD
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        const buttons = [
            { index: 1, quickReplyButton: { displayText: '📜 Main Menu', id: '.menu' } },
            { index: 2, quickReplyButton: { displayText: '👤 Owner Info', id: '.owner' } },
            { index: 3, quickReplyButton: { displayText: '⚡ Bot Speed', id: '.ping' } }
        ];

        const msg = generateWAMessageFromContent(from, {
            viewOnceMessage: {
                message: {
                    templateMessage: {
                        hydratedTemplate: {
                            imageMessage: { url: 'https://ibb.co' }, // ඔයාගේ ලස්සන Alive Image එක
                            hydratedContentText: status,
                            hydratedFooterText: "© Powered By Deneth MD",
                            hydratedButtons: buttons
                        }
                    }
                }
            }
        }, { userJid: conn.user.id, quoted: mek });

        // අලුත් ක්‍රමයට මැසේජ් එක සෙන්ඩ් කිරීම
        await conn.relayMessage(from, msg.message, { messageId: msg.key.id });

        // Delete loading message
        try {
            await conn.sendMessage(from, {
                delete: loading.key
            });
        } catch (err) {
            console.log("Loading message delete failed");
        }

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
