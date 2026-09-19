const { cmd, commands } = require('../command');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

cmd({
    pattern: "tourl",
    alias: ["img2url", "url", "makeurl"],
    desc: "Convert image to direct URL link with backup uploader",
    category: "utility",
    react: "🌐",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const isQuotedImage = quoted && (quoted.type === 'imageMessage' || (quoted.msg && quoted.msg.mimetype && quoted.msg.mimetype.startsWith('image/')));
        const isImage = m.type === 'imageMessage' || (m.msg && m.msg.mimetype && m.msg.mimetype.startsWith('image/'));

        if (!isImage && !isQuotedImage) {
            return reply("❌ කරුණාකර ඡායාරූපයකට (Photo) Reply කරන්න හෝ ඡායාරූපයක් සමඟ `.tourl` කමාන්ඩ් එක භාවිතා කරන්න.");
        }

        await reply("⏳ ඡායාරූපය ලින්ක් එකක් බවට පත් කරමින් පවතී, කරුණාකර රැඳී සිටින්න...");

        const messageToDownload = isQuotedImage ? quoted : m;
        const buffer = await downloadMediaMessage(
            messageToDownload,
            'buffer',
            {},
            { logger: console, reconnectIntervalMs: 5000 }
        );

        const tempFilename = `./temp_${Date.now()}.jpg`;
        fs.writeFileSync(tempFilename, buffer);

        let finalUrl = null;

        // --- ක්‍රමවේදය 1: Telegraph API (නිවැරදි කරන ලද ආකෘතිය) ---
        try {
            const form = new FormData();
            form.append('file', fs.createReadStream(tempFilename));
            const response = await axios.post('https://telegra.ph', form, { headers: form.getHeaders() });
            
            if (response.data && response.data[0] && response.data[0].src) {
                finalUrl = `https://telegra.ph${response.data[0].src}`;
            }
        } catch (err) {
            console.log("Telegraph upload failed, trying backup...");
        }

        // --- ක්‍රමවේදය 2: ImgBB (Backup Uploader - Free Keyless) ---
        if (!finalUrl) {
            try {
                const formImgBB = new FormData();
                formImgBB.append('image', fs.createReadStream(tempFilename));
                // ImgBB නිදහස් API එකක් භාවිතා කිරීම
                const responseImgBB = await axios.post('https://imgbb.com', formImgBB, {
                    headers: formImgBB.getHeaders()
                });
                if (responseImgBB.data && responseImgBB.data.data && responseImgBB.data.data.url) {
                    finalUrl = responseImgBB.data.data.url;
                }
            } catch (err) {
                console.log("ImgBB upload failed too.");
            }
        }

        // තාවකාලික ෆයිල් එක ඉවත් කිරීම
        if (fs.existsSync(tempFilename)) {
            fs.unlinkSync(tempFilename);
        }

        // ලින්ක් එක ලැබුණා නම් බ්ටන් මැසේජ් එක සාදා යැවීම
        if (finalUrl) {
            const successText = `✅ *IMAGE TO URL SUCCESS*\n\n👤 *Requested By:* ${pushname}\n🔗 *Direct Link:* ${finalUrl}`;

            const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("@whiskeysockets/baileys");

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

            const mediaMessage = await prepareWAMessageMedia({ image: { url: finalUrl } }, { upload: conn.waUploadToServer });

            const msg = generateWAMessageFromContent(from, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                            body: proto.Message.InteractiveMessage.Body.fromObject({ text: successText }),
                            footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "© Powered By Deneth MD" }),
                            header: proto.Message.InteractiveMessage.Header.fromObject({
                                title: "✨ DENETH MD URL UPLOADER ✨",
                                hasMediaAttachment: true,
                                imageMessage: mediaMessage.imageMessage
                            }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: buttons }),
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

            await conn.relayMessage(from, msg.message, { messageId: msg.key.id });

        } else {
            reply("❌ ඡායාරූපය Upload කිරීමට සර්වර්ස් දෙකම අපොහොසත් විය. කරුණාකර නැවත උත්සාහ කරන්න.");
        }

    } catch (e) {
        console.error("Error in tourl command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
