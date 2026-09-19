const { cmd } = require('../command');
const { proto } = require('@whiskeysockets/baileys');

cmd({
    pattern: "menu",
    alias: ["help"],
    category: "main",
    desc: "Baileys Native Flow Button Base Command"
}, async (conn, mek, msg, { jid, pushname }) => {
    try {
        // 1. Baileys වලට ගැලපෙන ලෙස අලුත්ම බටන් මැසේජ් ව්‍යුහය (Button Structure) සෑදීම
        const buttonMessage = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        // ප්‍රධාන පණිවිඩය (Main Text Body)
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `👋 *Hello ${pushname}!*\n\nThis is a 100% working Button Base built using @whiskeysockets/baileys.`
                        }),
                        // පාදම (Footer Text)
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: "🤖 QUEEN ELISA-MD Smart Base"
                        }),
                        // ශීර්ෂය (Header Title)
                        header: proto.Message.InteractiveMessage.Header.create({
                            title: "✨ QUEEN ELISA BUTTON SYSTEM ✨",
                            hasMediaAttachment: false
                        }),
                        // නියම බොත්තම් (Native Flow Buttons) එකතු කරන කොටස
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    // 🔘 පළමු බොත්තම (Quick Reply Button)
                                    "name": "quick_reply",
                                    "buttonParamsJson": JSON.stringify({
                                        "display_text": "📥 Download Menu",
                                        "id": "sub_download_click" // ක්ලික් කලාම index.js එකට යන ID එක
                                    })
                                },
                                {
                                    // 🔘 දෙවන බොත්තම (Quick Reply Button)
                                    "name": "quick_reply",
                                    "buttonParamsJson": JSON.stringify({
                                        "display_text": "ℹ️ About Bot",
                                        "id": "about_bot_click"
                                    })
                                },
                                {
                                    // 🌐 වෙබ් අඩවි ලින්ක් විවෘත කරන බොත්තම (URL Button)
                                    "name": "cta_url",
                                    "buttonParamsJson": JSON.stringify({
                                        "display_text": "🌐 Visit Website",
                                        "url": "https://github.com",
                                        "merchant_url": "https://github.com"
                                    })
                                }
                            ],
                        })
                    })
                }
            }
        };

        // 2. සාමාන්‍用 sendMessage වෙනුවට relayMessage මඟින් බටන් එක WhatsApp සර්වර් එකට යැවීම
        await conn.relayMessage(jid, buttonMessage, {});

    } catch (err) {
        console.log("Error sending Baileys button message:", err);
    }
});
