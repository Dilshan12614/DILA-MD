const { cmd } = require('../command');
const config = require('../config');
const path = require('path');
const fs = require('fs');

const audioPath = path.join(__dirname, '../media/goku_owner.mp3');

cmd({
    pattern: "owner",
    alias: ["dev", "hans", "byte", "bot"],
    react: "✅",
    desc: "Get owner number",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const ownerNumber = config.OWNER_NUM || "94740534738"; // fallback number
        const ownerName = config.OWNER_NAME || "HANS TECH";
        const ownerEmail = config.OWNER_EMAIL || "hans.tech@gmail.com"; // email එකත් add කරා

        const cleanNumber = ownerNumber.replace(/[^0-9]/g, ''); // + අයින් කරන safe method

        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
N:${ownerName};;;
ORG:Hans Tech
TITLE:Founder & Developer
TEL;TYPE=CELL,VOICE;waid=${cleanNumber}:${ownerNumber}
EMAIL:${ownerEmail}
URL:https://hans-byte-pair.onrender.com
NOTE:This is the official contact card of HANS TECH
END:VCARD
`;
        
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        }, { quoted: mek });

        await conn.sendMessage(from, {
            image: { url: 'https://i.ibb.co/PS5DZdJ/Chat-GPT-Image-Mar-30-2025-12-53-39-PM.png' },
            caption: `╭━━〔 *HANS BYTE* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *Here is the owner details*
┃◈┃• *Name* - ${ownerName}
┃◈┃• *Number* ${ownerNumber}
┃◈┃• *Version*: ${config.VERSION || "1.0.0"}
┃◈└───────────┈⊷
╰──────────────┈⊷
> © *HANS BYTE MD*`,
            contextInfo: {
                mentionedJid: [`${cleanNumber}@s.whatsapp.net`],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363292876277898@newsletter',
                    newsletterName: "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        if (fs.existsSync(audioPath)) {
            await conn.sendMessage(from, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: mek });
        } else {
            console.warn("[WARN] Audio file not found:", audioPath);
        }

    } catch (error) {
        console.error("[ERROR] An error occurred:", error);
        await conn.sendMessage(from, { text: `An error occurred: ${error.message}` }, { quoted: mek });
    }
});
