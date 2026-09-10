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

╭━━━〔 🚀 DILA 𝐌𝐃 〕━━━╮
┃
┃  ✨ *WELCOME TO DILA MD*
┃
┃  🤖 Your Personal WhatsApp Assistant
┃  ⚡ Fast • Smart • Powerful
┃  🛠️ Multi-Feature Bot
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 🤖 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 〕━━━╮
┃
┃  👋 Hello, *${pushname || "User"}*
┃  📚 Commands : *${commands.length}*
┃  🔰 Prefix   : *${config.PREFIX}*
┃  ⏱️ Uptime   : *${runtime(process.uptime())}*
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

✦━━━━━━━━━━━━━━━━━━━━━━✦
        *DILA 𝐌𝐃*
✦━━━━━━━━━━━━━━━━━━━━━━✦

> *POWERED BY DILSHAN*

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

╭━━━〔 📢 𝐍𝐄𝐖𝐒𝐋𝐄𝐓𝐓𝐄𝐑 〕━━━╮
┃
┃        ✦ 𝐃𝐈𝐋𝐀 𝐌𝐃 ✦
┃
┃   🚀 *Stay Connected With Us*
┃   💫 *Updates • Features • News*
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

        

> ╰┈➤  ⚡*POWERED BY DILA MD*⚡

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
            "DiLA 𝐌𝐃",

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
              "https://i.ibb.co/6JrfGTrG/temp-image.jpg",
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
