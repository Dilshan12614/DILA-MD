const { cmd, commands } = require('../command');
const { ApifyClient } = require('apify-client');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// 🔑 ඔයාගේ Apify API Token එක
const APIFY_TOKEN = process.env.APIFY_TOKEN || "apify_api_o26QUamyP05T5mIlQUZ974yUGLJTed0dScHR";
const client = new ApifyClient({ token: APIFY_TOKEN });

cmd({
    pattern: "scrapehtml",
    alias: ["gethtml", "html", "scrape"],
    desc: "Download HTML and send with an interactive button link",
    category: "download",
    react: "🌐",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, pushname, reply }) => {
    try {
        if (!q || !q.startsWith('http')) {
            return reply("❌ කරුණාකර වලංගු වෙබ් අඩවි URL එකක් ලබා දෙන්න.\n\n*උදාහරණ:* `.scrapehtml https://example.com`");
        }

        await reply("⏳ Apify ScrapeAI හරහා HTML ලබා ගනිමින් පවතී...");

        // 🕷️ Apify Actor එක Run කිරීම
        const run = await client.actor('scrapeai/html-downloader').call({
            requestListSources: [{ url: q }],
            proxyConfiguration: { useApifyProxy: true },
            handlePageTimeoutSecs: 60,
            maxRequestRetries: 1,
            useChrome: false
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        if (!items || items.length === 0 || !items[0].html) {
            return reply("❌ HTML කේතය ලබා ගැනීමට නොහැකි විය.");
        }

        const htmlContent = items[0].html;
        const urlObj = new URL(q);
        const domainName = urlObj.hostname.replace('www.', '');
        const tempFilePath = `./${domainName}_source.html`; // .html ලෙස සුරැකීම

        fs.writeFileSync(tempFilePath, htmlContent, 'utf-8');

        // --- 🌐 HTML ෆයිල් එක ඔන්ලයින් ලින්ක් එකක් (URL) බවට පත් කිරීම ---
        let webPreviewUrl = null;
        try {
            const form = new FormData();
            form.append('file', fs.createReadStream(tempFilePath));
            const uploadRes = await axios.post('https://telegra.ph', form, { headers: form.getHeaders() });
            if (uploadRes.data && uploadRes.data[0] && uploadRes.data[0].src) {
                webPreviewUrl = `https://telegra.ph${uploadRes.data[0].src}`;
            }
        } catch (err) {
            console.log("Telegraph upload failed, using file mode only.");
        }

        // --- 🎛️ NATIVE FLOW CTA_URL BUTTONS (PATHUMTECH BAILEYS) ---
        const { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");
        
        const successText = `✅ *HTML DOWNLOAD SUCCESS*
        
🌐 *Target URL:* ${q}
👤 *Requested By:* ${pushname}
📊 *Status:* Completed via Apify`;

        // ලින්ක් එක ලැබුණොත් බ්ටන් එක සෙට් කරනවා, නැත්නම් හිස්ව තබනවා
        const buttons = [];
        if (webPreviewUrl) {
            buttons.push({
                "name": "cta_url",
                "buttonParamsJson": JSON.stringify({
                    "display_text": "Open Webpage 🌐",
                    "url": webPreviewUrl,
                    "merchant_url": webPreviewUrl
                })
            });
        }

        // Interactive Message එකක් ලෙස සකසා යැවීම
        const msg = generateWAMessageFromContent(from, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({ text: successText }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "© Powered By Deneth MD" }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            title: "✨ DENETH MD SCRAPER SYSTEM ✨",
                            hasMediaAttachment: false
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: buttons }),
                        contextInfo: { mentionedJid: [m.sender] }
                    })
                }
            }
        }, { userJid: conn.user.jid, quoted: mek });

        // 1. මුලින්ම බ්ටන් මැසේජ් එක යැවීම
        await conn.relayMessage(from, msg.message, { messageId: msg.key.id });

        // 2. පසුව ඩවුන්ලෝඩ් කරගත් මුල් .html ෆයිල් එක Document එකක් විදිහටත් යැවීම
        await conn.sendMessage(from, {
            document: fs.readFileSync(tempFilePath),
            mimetype: 'text/html',
            fileName: `${domainName}_source.html`
        }, { quoted: mek });

        // තාවකාලික ෆයිල් එක මැකීම
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

    } catch (e) {
        console.error("Error:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
