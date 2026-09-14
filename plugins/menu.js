const { cmd, commands } = require("../command");
const config = require("../config");
const { runtime } = require("../lib/functions");

cmd(
  {
    pattern: "menu",
    alias: ["getmenu", "allmenu"],
    react: "📔",
    desc: "Get command list with buttons",
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
      let madeMenu = `╭━━━〔 🚀 DENETH 𝐌𝐃 🚀〕━━━╮
┃
┃  ✨ *WELCOME TO DENETH MD* ✨
┃
┃  🤖 Your Personal WhatsApp Assistant
┃  ⚡ Fast • Smart • Powerful
┃  🛠️ Multi-Feature Bot
┃
╰━━━━━━━━━━━━━━━━━━━━━

╭━━〔 🤖 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 🤖 〕━━━╮
┃
┃  👋 Hello, *${pushname || "User"}*
┃  📚 Commands : *${commands.length}*
┃  🔰 Prefix   : *${config.PREFIX}*
┃  ⏱️ Uptime   : *${runtime(process.uptime())}*
┃
╰━━━━━━━━━━━━━━━━━━━━━

✦━━━━━━━━━━━━━━━━━━━━━
          🧑‍💻 *DENETH-𝐌𝐃* 🧑‍💻  
✦━━━━━━━━━━━━━━━━━━━━━`;

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
        madeMenu += `╰─⊲⋅════════━━━━━┈⊷\n`;
      }

      madeMenu += `\n> ⚡*POWERED BY DENETH MD*⚡`;

      // ==========================================
      // 100% WORKING BUTTON SYSTEM
      // ==========================================
      const templateButtons = [
          { index: 1, quickReplyButton: { displayText: '👤 Owner Info', id: '.owner' } },
          { index: 2, quickReplyButton: { displayText: '🧚‍♂️ Alive Status', id: '.alive' } },
          { index: 3, quickReplyButton: { displayText: '⚡ Bot Speed', id: '.ping' } }
      ];

      // ==========================================
      // NEWSLETTER CONTEXT
      // ==========================================
      const newsletterContext = {
        mentionedJid: sender ? [sender] : [],
        forwardingScore: 1000,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363429118791328@newsletter",
          newsletterName: "DENETH 𝐌𝐃",
          serverMessageId: 143,
        },
      };

      // ==========================================
      // SEND MENU WITH IMAGE & BUTTONS
      // ==========================================
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://ibb.co", // ඔයා එවපු අලුත්ම ලස්සන Logo Image එක
          },
          caption: madeMenu,
          footer: "© Powered By Deneth MD",
          templateButtons: templateButtons,
          contextInfo: newsletterContext,
        },
        {
          quoted: mek,
        }
      );

    } catch (e) {
      console.error("MENU ERROR:", e);
      reply(`❌ Menu Error\n\n${e.message || e}`);
    }
  }
);
