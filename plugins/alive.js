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
        // STEP 7 - BUTTONS SETTING
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        const myButtons = [
            { buttonId: '.menu', buttonText: { displayText: '📜 Main Menu' }, type: 1 },
            { buttonId: '.owner', buttonText: { displayText: '👤 Owner Info' }, type: 1 },
            { buttonId: '.ping', buttonText: { displayText: '⚡ Bot Speed' }, type: 1 }
        ];

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // SEND FINAL MESSAGE WITH BUTTONS
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        await conn.sendButtonText(
            from, 
            myButtons, 
            status, 
            "© Powered By Deneth MD", 
            mek,
            {
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
            }
        );

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
