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
      // NEW 100% WORKING LIST BUTTONS SETUP
      // ==========================================
      const sections = [
        {
          title: "📌 Main Options",
          rows: [
            { title: "📜 Main Menu", rowId: `${config.PREFIX}menu`, description: "Show bot command list" },
            { title: "⚡ Alive Check", rowId: `${config.PREFIX}alive`, description: "Check if bot is online" },
            { title: "🧑‍💻 Owner Info", rowId: `${config.PREFIX}owner`, description: "Get developer details" }
          ]
        }
      ];

      const listMessage = {
        text: madeMenu,
        footer: "© POWERED BY DENETH MD",
        title: "✨ *DENETH MD COMMAND MENU* ✨",
        buttonText: "Click Here 🚀",
        sections,
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
      };

      // ලෝගෝ පින්තූරය මුලින් යැවීම
      await robin.sendMessage(from, { image: { url: "https://telegra.ph" } }, { quoted: mek });

      // ලිස්ට් බටන් මැසේජ් එක යැවීම
      await robin.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
      console.error("MENU ERROR:", e);
      reply(`❌ Menu Error\n\n${e.message || e}`);
    }
  }
);
