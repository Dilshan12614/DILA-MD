const { cmd, commands } = require("../command");
const config = require("../config");
const os = require("os");
const { runtime } = require("../lib/functions");

cmd(
  {
    pattern: "menu",
    alias: ["getmenu", "allmenu"],
    react: "📔",
    desc: "Get elegant number list menu",
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
      // පද්ධතියේ විස්තර ලබා ගැනීම
      const ramUsage = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB`;
      const botRuntime = runtime(process.uptime());

      // ඔයා ඉල්ලපු ලස්සන මෙනු හැඩතල සැකසුම (Design)
      let madeMenu = `*HELLO ${pushname || "User"}*

*╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」*
*│◈ 𝚁𝙰𝙼 𝚄𝚂𝙰𝙶𝙴 -* ${ramUsage}
*│◈ 𝚁𝚄𝙽𝚃𝙸𝙼𝙴 -* ${botRuntime}
*╰──────────●●►*
╭──────────●●►
│⛵ *LIST MENU*
│    ───────
│  1      *CONVERT*
│ _2_     *OWNER*
│ _3_     *MAIN*
│ _4_     *MATHTOOL*
│ _5_     *DOWNLOAD*
│ _6_     *SEARCH*
│ _7_     *AI*
│ _8_     *GROUP*
│ _9_     *CHANNEL*
│ _10_    *GAME*
│ _11_    *STICKER*
│ _12_    *SUBBOT*
╰───────────●●►

*Reply the Number you want to select*`;

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
      // SEND MENU WITH IMAGE & TEXT
      // ==========================================
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://ibb.co", // ඔයා එවපු ලස්සන කොළ පාට Logo එක
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
      reply(`❌ Menu Error\n\n${e.message || e}`);
    }
  }
);
