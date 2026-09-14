const { cmd, commands } = require("../command");
const config = require("../config");
const os = require("os");
const { runtime } = require("../lib/functions");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// प्रධාන MENU COMMAND එක (MAIN MENU)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd(
  {
    pattern: "menu",
    alias: ["getmenu", "allmenu"],
    react: "📔",
    desc: "Get elegant number list menu",
    category: "main",
    filename: __filename,
  },

  async (robin, mek, m, { from, sender, pushname, reply }) => {
    try {
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
│ _1_     *CONVERT*
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

      await robin.sendMessage(
        from,
        {
          image: { url: "https://ibb.co" }, // ඔයා එවපු ලස්සන කොළ පාට Logo එක
          caption: madeMenu,
          contextInfo: newsletterContext,
        },
        { quoted: mek }
      );

    } catch (e) {
      console.error("MENU ERROR:", e);
      reply(`❌ Menu Error\n\n${e.message || e}`);
    }
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NUMBER REPLIES කියවන පද්ධතිය (SUB MENU EXECUTION)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cmd(
  {
    on: "text"
  },
  async (robin, mek, m, { from, body, sender, reply }) => {
    try {
      // මැසේජ් එකක් රිප්ලයි එකක්ද සහ එහි contextInfo තිබේදැයි බැලීම
      if (!mek.message || !mek.message.extendedTextMessage || !mek.message.extendedTextMessage.contextInfo) return;

      const quotedMsg = mek.message.extendedTextMessage.contextInfo.quotedMessage;
      const textReply = body ? body.trim() : '';

      // අපි එවපු මෙනු එකටමද මේ රිප්ලයි කරන්නේ කියලා එහි '⛵ *LIST MENU*' කොටසින් තහවුරු කරගැනීම
      if (quotedMsg && quotedMsg.imageMessage && quotedMsg.imageMessage.caption && quotedMsg.imageMessage.caption.includes('⛵ *LIST MENU*')) {
        
        let targetCategory = "";
        
        // නම්බර් එක අනුව අදාළ Category එක තෝරාගැනීම
        if (textReply === '1') targetCategory = "convert";
        else if (textReply === '2') targetCategory = "owner";
        else if (textReply === '3') targetCategory = "main";
        else if (textReply === '4') targetCategory = "mathtool";
        else if (textReply === '5') targetCategory = "download";
        else if (textReply === '6') targetCategory = "search";
        else if (textReply === '7') targetCategory = "ai";
        else if (textReply === '8') targetCategory = "group";
        else if (textReply === '9') targetCategory = "channel";
        else if (textReply === '10') targetCategory = "game";
        else if (textReply === '11') targetCategory = "sticker";
        else if (textReply === '12') targetCategory = "subbot";
        else return; // වෙනත් අංකයක් නම් කිසිවක් නොකරයි

        // තෝරාගත් Category එකට අදාළ කමාන්ඩ්ස් ලැයිස්තුව ස්වයංක්‍රීයව එකතු කිරීම
        const filteredCommands = commands.filter(cmd => cmd.category && cmd.category.toLowerCase() === targetCategory);
        
        if (filteredCommands.length === 0) {
          return reply(`⚠️ *No commands found under ${targetCategory.toUpperCase()} category!*`);
        }

        let subMenuText = `*╭─「 📂 ${targetCategory.toUpperCase()} ᴍᴇɴᴜ 」*\n`;
        subMenuText += `*│*\n`;
        
        filteredCommands.forEach(cmd => {
          if (cmd.pattern) {
            subMenuText += `*│ ⌬* \`${config.PREFIX}${cmd.pattern}\` ${cmd.desc ? `- _${cmd.desc}_` : ''}\n`;
          }
        });
        
        subMenuText += `*│*\n`;
        subMenuText += `*╰──────────●●►*\n\n> *© Powered By Deneth MD*`;

        // Sub Menu එක යැවීම
        await robin.sendMessage(from, { text: subMenuText }, { quoted: mek });
      }
    } catch (e) {
      console.error("NUMBER REPLY ERROR:", e);
    }
  }
);
