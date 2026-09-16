const { cmd, commands } = require("../command");
const config = require("../config");
const { runtime } = require("../lib/functions");

cmd(
  {
    pattern: "menu3",
    alias: ["listmenu"],
    react: "📔",
    desc: "Get force interactive block message menu",
    category: "main",
    filename: __filename,
  },

  async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {

      // ==========================================
      // AUTO COMMAND CATEGORIES
      // ==========================================
      const categories = {};

      for (let i = 0; i < commands.length; i++) {
        const cmdData = commands[i];
        if (cmdData.pattern && !cmdData.dontAddCommandList) {
          const category = (cmdData.category || "other").toLowerCase();
          if (!categories[category]) {
            categories[category] = [];
          }
          categories[category].push(`${config.PREFIX}${cmdData.pattern}`);
        }
      }

      // ==========================================
      // MENU CONTENT GENERATOR
      // ==========================================
      let madeMenu = `
╭━━━〔 🚀DENETH 𝐌𝐃🚀〕━━━╮
┃
┃  ✨ *WELCOME TO DENETH MD* ✨
┃
┃  🤖 Your Personal WhatsApp Assistant
┃  ⚡ Fast • Smart • Powerful
┃  🛠️ Multi-Feature Bot
┃
╰━━━━━━━━━━━━━━━━━━━━━

╭━━〔 🤖𝐁𝐎𝐓 𝐈𝐍𝐅𝐎🤖 〕━━━╮
┃
┃  👋 Hello, *${pushname || "User"}*
┃  📚 Commands : *${commands.length}*
┃  🔰 Prefix   : *${config.PREFIX}*
┃  ⏱️ Uptime   : *${runtime(process.uptime())}*
┃
╰━━━━━━━━━━━━━━━━━━━━━\n`;

      for (const [category, cmdList] of Object.entries(categories)) {
        madeMenu += `\n╭─⊳⋅📂 *${category.toUpperCase()}* ⋅⊲─╮\n`;
        for (const command of cmdList) {
          madeMenu += `┃ ⌬ ${command}\n`;
        }
        madeMenu += `╰─⊲⋅════════━━━━━┈⊷\n`;
      }

      madeMenu += `\n> ⚡ *POWERED BY DENETH MD* ⚡`;

      // ==========================================
      // FORCE INTERACTIVE STRUCTURE (NO BUTTONS, SHOWS VERSION ERROR)
      // ==========================================
      const { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");

      const msg = generateWAMessageFromContent(from, {
          viewOnceMessage: {
              message: {
                  messageContextInfo: {
                      deviceListMetadata: {},
                      deviceListMetadataVersion: 2
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                      body: proto.Message.InteractiveMessage.Body.fromObject({
                          text: madeMenu
                      }),
                      footer: proto.Message.InteractiveMessage.Footer.fromObject({
                          text: "© Powered By Deneth MD"
                      }),
                      header: proto.Message.InteractiveMessage.Header.fromObject({
                          title: "✨ *DENETH MD COMMAND MENU* ✨",
                          hasMediaAttachment: false
                      }),
                      carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                          cards: [
                              proto.Message.InteractiveMessage.fromObject({
                                  body: proto.Message.InteractiveMessage.Body.fromObject({ text: "" }),
                                  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                      buttons: [] // බටන්ස් පෙනෙන්න නැති වෙන්න හිස්ව තැබුවා
                                  })
                              })
                          ]
                      }),
                      contextInfo: {
                          mentionedJid: sender ? [sender] : [],
                          forwardingScore: 1000,
                          isForwarded: true,
                          forwardedNewsletterMessageInfo: {
                              newsletterJid: "120363429118791328@newsletter",
                              newsletterName: "DENETH 𝐌𝐃",
                              serverMessageId: 143
                          }
                      }
                  })
              }
          }
      }, { userJid: conn.user.jid, quoted: mek }); // 👈 robin වෙනුවට conn ලෙස නිවැරදි කළා

      // මැසේජ් එක වට්ස්ඇප් වෙත බලෙන් යැවීම
      await conn.relayMessage(from, msg.message, { messageId: msg.key.id }); // 👈 robin වෙනුවට conn ලෙස නිවැරදි කළා

    } catch (e) {
      console.error("MENU3 ERROR:", e);
      reply(`❌ Menu3 Error\n\n${e.message || e}`);
    }
  }
);
