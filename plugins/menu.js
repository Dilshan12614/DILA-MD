const { cmd, commands } = require("../command");
const config = require("../config");
const { runtime } = require("../lib/functions");

cmd(
  {
    pattern: "menu",
    alias: ["getmenu"],
    react: "📔",
    desc: "Get command list",
    category: "main",
    filename: __filename,
  },

  async (
    robin,
    mek,
    m,
    {
      from,
      sender,
      pushname,
      reply,
    }
  ) => {
    try {

      // ==========================================
      // AUTO COMMAND CATEGORIES
      // ==========================================
      const categories = {};

      for (let i = 0; i < commands.length; i++) {
        const cmdData = commands[i];
        if (
          cmdData.pattern &&
          !cmdData.dontAddCommandList
        ) {
          const category = (cmdData.category || "other").toLowerCase();
          if (!categories[category]) {
            categories[category] = [];
          }
          categories[category].push(
            `${config.PREFIX}${cmdData.pattern}`
          );
        }
      }

      // ==========================================
      // MENU HEADER
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
╰━━━━━━━━━━━━━━━━━━━━━

✦━━━━━━━━━━━━━━━━━━━━━
           🧑‍💻*DENETH-𝐌𝐃*🧑‍💻  
✦━━━━━━━━━━━━━━━━━━━━━

> *POWERED BY DANUWA*

`;

      // ==========================================
      // AUTOMATIC COMMAND MENU
      // ==========================================
      for (const [category, cmdList] of Object.entries(categories)) {
        madeMenu += `
╭─⊳⋅📂 *${category.toUpperCase()}* ⋅⊲─╮
`;
        for (const command of cmdList) {
          madeMenu += `┃ ⌬ ${command}\n`;
        }
        madeMenu += `╰─⊲⋅════════━━━━━┈⊷\n\n`;
      }

      // ==========================================
      // FOOTER
      // ==========================================
      madeMenu += `
╭━━━〔 📢 𝐍𝐄𝐖𝐒𝐋𝐄𝐓𝐓𝐄𝐑 〕━━━╮
┃
┃        ✦ 𝐃𝐄𝐍𝐄𝐓𝐇 𝐌𝐃 ✦
┃
┃   🚀 *Stay Connected With Us*
┃   💫 *Updates • Features • News*
┃
╰━━━━━━━━━━━━━━━━━━━━━

        
> ⚡*POWERED BY DENETH MD*⚡
`;

      // ==========================================
      // BUTTONS SETUP
      // ==========================================
      const buttons = [
          { 
              name: 'quick_reply', 
              buttonParamsJson: JSON.stringify({ 
                  display_text: '📜 Main Menu', 
                  id: `${config.PREFIX}menu` 
              }) 
          },
          { 
              name: 'quick_reply', 
              buttonParamsJson: JSON.stringify({ 
                  display_text: '⚡ Alive Check', 
                  id: `${config.PREFIX}alive` 
              }) 
          },
          { 
              name: 'quick_reply', 
              buttonParamsJson: JSON.stringify({ 
                  display_text: '🧑‍💻 Owner Info', 
                  id: `${config.PREFIX}owner` 
              }) 
          }
      ];

      // ==========================================
      // GENERATE INTERACTIVE BUTTON MESSAGE WITH IMAGE
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
                          text: "© POWERED BY DENETH MD"
                      }),
                      header: proto.Message.InteractiveMessage.Header.fromObject({
                          title: "✨ *DENETH MD COMMAND MENU* ✨",
                          hasMediaAttachment: true,
                          imageMessage: (await robin.prepareMessageMedia({ image: { url: "https://telegra.ph" } }, { upload: robin.waUploadToServer })).imageMessage
                      }),
                      carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                          cards: [
                              proto.Message.InteractiveMessage.fromObject({
                                  body: proto.Message.InteractiveMessage.Body.fromObject({ text: "" }),
                                  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                      buttons: buttons
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
      }, { userJid: robin.user.jid, quoted: mek });

      // ==========================================
      // SEND REPLAY MESSAGE
      // ==========================================
      await robin.relayMessage(from, msg.message, { messageId: msg.key.id });

    } catch (e) {
      console.error("MENU ERROR:", e);
      reply(`❌ Menu Error\n\n${e.message || e}`);
    }
  }
);
