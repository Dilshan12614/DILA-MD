const { cmd, commands } = require("../command");
const config = require("../config");

cmd(
  {
    pattern: "menu",
    alias: ["getmenu"],
    react: "📔",
    desc: "Get simple welcome menu",
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
      reply,
    }
  ) => {
    try {

      // ==========================================
      // SEND ONLY IMAGE WITH WELCOME TEXT
      // ==========================================
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://telegra.ph", 
          },
          caption: "Hello welcome to DENETH-MD",
          contextInfo: {
            mentionedJid: sender ? [sender] : [],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363429118791328@newsletter",
              newsletterName: "DENETH 𝐌𝐃",
              serverMessageId: 143,
            },
          },
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
