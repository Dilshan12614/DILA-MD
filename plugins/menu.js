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

          const category =
            (cmdData.category || "other").toLowerCase();

          if (!categories[category]) {
            categories[category] = [];
          }

          categories[category].push(
            `${config.PREFIX}${cmdData.pattern}`
          );
        }
      }


      // ==========================================
      // SYSTEM INFORMATION
      // ==========================================

      const platform = process.platform;


      // ==========================================
      // MENU HEADER
      // ==========================================

      let madeMenu = `

╭━━━〔 🚀 𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃 〕━━━╮
┃
┃  ✨ *WELCOME TO HANS BYTE MD*
┃
┃  🤖 Your Personal WhatsApp Assistant
┃  ⚡ Fast • Smart • Powerful
┃  🛠️ Multi-Feature Bot
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 📡 BOT CENTER 〕━━╮
┃
┃  👋 Hello, *${pushname || "User"}*
┃  📚 Commands : *${commands.length}*
┃  🔰 Prefix   : *${config.PREFIX}*
┃  ⏱️ Uptime   : *${runtime(process.uptime())}*
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

✦━━━━━━━━━━━━━━━━━━━━━━✦
        *𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃*
✦━━━━━━━━━━━━━━━━━━━━━━✦


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

        madeMenu += `╰─⊲⋅════════━━━━━┈⊷

`;
      }


      // ==========================================
      // FOOTER
      // ==========================================

      madeMenu += `
╭━━━━━━━━━━━━━━━━━━━━╮
┃ 📢 *NEWSLETTER*
┃
┃ 𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃
╰━━━━━━━━━━━━━━━━━━━━╯

✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧
       *HANS BYTE MD*
✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧⋄⋆⋅⋆⋄✧
`;


      // ==========================================
      // NEWSLETTER CONTEXT
      // ==========================================

      const newsletterContext = {

        mentionedJid: sender
          ? [sender]
          : [],

        forwardingScore: 1000,

        isForwarded: true,

        forwardedNewsletterMessageInfo: {

          newsletterJid:
            "120363292876277898@newsletter",

          newsletterName:
            "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",

          serverMessageId: 143,
        },
      };


      // ==========================================
      // SEND MENU
      // ==========================================

      await robin.sendMessage(
        from,
        {
          image: {
            url:
              "https://i.ibb.co/6Rxhg321/Chat-GPT-Image-Mar-30-2025-03-39-42-AM.png",
          },

          caption: madeMenu,

          contextInfo: newsletterContext,
        },

        {
          quoted: mek,
        }
      );

    } catch (e) {

      console.error("MENU ERROR:", e);

      reply(
        `❌ Menu Error\n\n${e.message || e}`
      );
    }
  }
);
