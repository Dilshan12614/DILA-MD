const { cmd, commands } = require("../command");
const config = require("../config");

cmd(
  {
    pattern: "menu3",
    alias: ["listmenu"],
    react: "📁",
    desc: "Get beautiful list button menu",
    category: "main",
    filename: __filename,
  },

  async (robin, mek, m, { from, sender, reply }) => {
    try {
      const { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");

      // ස්ක්‍රීන්ෂොට් එකේ තිබුණු විදිහටම ලිස්ට් එකේ Options (තේරීම්) සකස් කිරීම
      const sections = [
        {
          title: "🎬 Select Movie / Video Quality",
          rows: [
            { title: "1. 📁 Video (Document) • 720p", rowId: `${config.PREFIX}vid720`, description: "Download in SD quality" },
            { title: "2. 📁 Video (Document) • 1080p", rowId: `${config.PREFIX}vid1080`, description: "Download in Full HD quality" },
            { title: "3. 📁 Video (Document) • 2560p", rowId: `${config.PREFIX}vid2560`, description: "Download in Ultra HD 2K quality" }
          ]
        }
      ];

      // ලිස්ට් මැසේජ් එකේ ප්‍රධාන ව්‍යුහය
      const listMessage = {
        text: "Reply to this message with a number (1-3)\n🔄 You can select multiple options!", // ඔයාගේ ස්ක්‍රීන්ෂොට් එකේ තිබුණු ප්‍රධාන වැකිය
        footer: "│ © Powered by LUXALGO ♡", // ඔයාගේ ස්ක්‍රීන්ෂොට් එකේ තිබුණු Footer එක
        title: "✨ *DENETH MD VIDEO DOWNLOADER* ✨",
        buttonText: "Select Quality 🚀", // බොත්තම මත දිස්වන වැකිය
        sections: sections,
        contextInfo: {
          mentionedJid: sender ? [sender] : [],
          forwardingScore: 1000,
          isForwarded: true
        }
      };

      // ලිස්ට් බටන් මැසේජ් එක වට්ස්ඇප් වෙත යැවීම
      await robin.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
      console.error("MENU3 ERROR:", e);
      reply(`❌ Menu3 Error\n\n${e.message || e}`);
    }
  }
);
