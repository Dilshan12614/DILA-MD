const { cmd, commands } = require('../command');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

cmd({
    pattern: "tourl",
    alias: ["img2url", "url", "makeurl"],
    desc: "Convert image to direct URL link with button",
    category: "utility",
    react: "🌐",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // රිප්ලයි කරපු මැසේජ් එකක් හෝ කෙලින්ම එවපු මැසේජ් එකක්ද කියා බැලීම
        const isQuotedImage = quoted && (quoted.type === 'imageMessage' || (quoted.msg && quoted.msg.mimetype && quoted.msg.mimetype.startsWith('image/')));
        const isImage = m.type === 'imageMessage' || (m.msg && m.msg.mimetype && m.msg.mimetype.startsWith('image/'));

        if (!isImage && !isQuotedImage) {
            return reply("❌ කරුණාකර ඡායාරූපයකට (Photo) Reply කරන්න හෝ ඡායාරූපයක් සමඟ `.tourl` කමාන්ඩ් එක භාවිතා කරන්න.");
        }

        // Processing මැසේජ් එකක් යැවීම
        await reply("⏳ ඡායාරූපය ලින්ක් එකක් බවට පත් කරමින් පවතී, කරුණාකර රැඳී සිටින්න...");

        // ඡායාරූපය ඩවුන්ලෝඩ් කරගැනීම
        const messageToDownload = isQuotedImage ? quoted : m;
        const buffer = await downloadMediaMessage(
            messageToDownload,
            'buffer',
            {},
            { 
                logger: console,
                reconnectIntervalMs: 5000
            }
        );

        // තාවකාලිකව ෆයිල් එක සේව් කිරීම
        const tempFilename = `./temp_${Date.now()}.jpg`;
        fs.writeFileSync(tempFilename, buffer);

        // Telegraph API එක වෙත ෆොටෝ එක Upload කිරීම
        const form = new FormData();
        form.append('file', fs.createReadStream(tempFilename));

        const response = await axios.post('https://telegra.ph', form, {
            headers: form.getHeaders()
        });

        // තාවකාලික ෆයිල් එක ඩිලීට් කිරීම
        fs.unlinkSync(tempFilename);

        // ප්‍රතිඵලය පරිශීලකයා වෙත යැවීම
        if (response.data && response.data[0] && response.data[0].src) {
            const finalUrl = `https://telegra.ph${response.data[0].src}`;
            
            const successText = `✅ *IMAGE TO URL SUCCESS*\n\n👤 *Requested By:* ${pushname}\n🔗 *Direct Link:* ${finalUrl}`;

            // =================================================================
            // NATIVE FLOW CTA_URL BUTTON STRUCTURE (PATHUMTECH BAILEYS)
            // =================================================================
            const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("@whiskeysockets/baileys");

            // ලින්ක් එක ක්ලික් කරලා වෙබ් බ්‍රවුසර් එකෙන් ඕපන් කරගන්න බ්ටන් එක
            const buttons = [
                {
                    "name": "cta_url",
                    "buttonParamsJson": JSON.stringify({
                        "display_text": "Open Image 🌐",
                        "url": finalUrl,
                        "merchant_url": finalUrl
                    })
                }
            ];

            // අපි අප්ලෝඩ් කරපු ෆොටෝ එකම ආපහු බ්ටන් එකේ උඩ Header එකට සෙට් කරනවා
            const mediaMessage = await prepareWAMessageMedia({ image: { url: finalUrl } }, { upload: conn.waUploadToServer });

            const msg = generateWAMessageFromContent(from, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                            body: proto.Message.InteractiveMessage.Body.fromObject({
                                text: successText
                            }),
                            footer: proto.Message.InteractiveMessage.Footer.fromObject({
                                text: "© Powered By Deneth MD"
                            }),
                            header: proto.Message.InteractiveMessage.Header.fromObject({
                                title: "✨ DENETH MD URL UPLOADER ✨",
                                hasMediaAttachment: true,
                                imageMessage: mediaMessage.imageMessage
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
            }, { userJid: conn.user.jid, quoted: mek });

            // මැසේජ් එක වට්ස්ඇප් වෙත යැවීම
            await conn.relayMessage(from, msg.message, { messageId: msg.key.id });

        } else {
            reply("❌ ඡායාරූපය Upload කිරීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.");
        }

    } catch (e) {
        console.error("Error in tourl command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
