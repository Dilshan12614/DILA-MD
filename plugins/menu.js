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

      madeMenu += `> ⚡*POWERED BY DENETH MD*⚡`;

      // ==========================================
      // 100% WORKING HYDRATED BUTTONS STRUCTURE
      // ==========================================
      const templateButtons = [
        {
          index: 1,
          urlButton: {
            displayText: '🧑‍💻 Contact Owner',
            url: `https://wa.me{config.OWNER_NUMBER}`
          }
        },
        {
          index: 2,
          callButton: {
            displayText: '📞 Call Owner',
            phoneNumber: `${config.OWNER_NUMBER}`
          }
        }
      ];

      // ==========================================
      // SEND HYDRATED MESSAGE WITH IMAGE
      // ==========================================
      await robin.sendMessage(from, {
        image: { url: "https://telegra.ph" },
        caption: madeMenu,
        footer: "© POWERED BY DENETH MD",
        templateButtons: templateButtons,
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
      }, { quoted: mek });

    } catch (e) {
      console.error("MENU ERROR:", e);
      reply(`❌ Menu Error\n\n${e.message || e}`);
    }
  }
);
