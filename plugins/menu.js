const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "menu",
    desc: "Displays all available commands",
    category: "main",
    filename: __filename,
  },
  async (danuwa, mek, m, { from, reply }) => {
    try {
      const categories = {};

      // commands object එකෙන් commands ගන්න
      for (const cmdName in commands) {
        const cmdData = commands[cmdName];

        const cat = (cmdData.category || "other").toLowerCase();

        if (!categories[cat]) {
          categories[cat] = [];
        }

        categories[cat].push({
          pattern: cmdData.pattern || cmdName,
          desc: cmdData.desc || "No description"
        });
      }

      // Newsletter details
      const newsletterName = "DILA-MD NEWS";
      const newsletterJid = "120363XXXXXXXXXXXX@newsletter";

      let menuText = `
╭━━━〔 *DILA-MD* 〕━━━╮
┃ 📢 *Newsletter:* ${newsletterName}
┃ 🆔 *JID:* ${newsletterJid}
╰━━━━━━━━━━━━━━━━━━╯

📋 *AVAILABLE COMMANDS*
`;

      for (const [cat, cmds] of Object.entries(categories)) {
        menuText += `\n📂 *${cat.toUpperCase()}*\n`;

        for (const c of cmds) {
          menuText += `┃ • .${c.pattern} - ${c.desc}\n`;
        }
      }

      await danuwa.sendMessage(
        from,
        {
          image: {
            url: "https://n.uguu.se/PbeEXJzq.jpg"
          },
          caption: menuText.trim()
        },
        {
          quoted: mek
        }
      );

    } catch (err) {
      console.error("MENU ERROR:", err);
      reply("❌ Error generating menu.\n\n" + err.message);
    }
  }
);
