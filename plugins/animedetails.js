const { cmd } = require("../command");
const { getep } = require("darksadasyt-anime");

cmd(
  {
    pattern: "animedetails",
    react: "🎭",
    desc: "Get Anime Details and Episodes",
    category: "anime",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      if (!q) return reply("*Please provide an anime link.* 🎭");

      // Newsletter context info (DENETH-MD)
      const newsletterContext = {
        'mentionedJid': [sender],
        'forwardingScore': 0x3e7,
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': '120363292876277898@newsletter',
          'newsletterName': "DENETH 𝐌𝐃",
          'serverMessageId': 0x8f
        }
      };

      // Fetching the anime details
      const results = await getep(q);
      
      // 👈 මෙන්න මෙතන තමයි වැරැද්ද හැදුවේ. results එක ඇතුලේ දත්ත තියෙනවද කියා පරීක්ෂා කිරීම:
      if (!results || !results.result) {
        return reply("❌ *Anime details not found! Please check the link and try again.*");
      }

      const { result, results: episodeList } = results;

      // Constructing the anime details message
      let detailsMessage = `🎬 *Anime Details for* ${result.title || "Unknown"} 🎬\n\n`;
      detailsMessage += `📅 *Release Date*: ${result.date || "N/A"}\n`;
      detailsMessage += `⭐ *IMDb Rating*: ${result.imdb || "N/A"}\n`;
      detailsMessage += `🎥 *Total Episodes*: ${result.epishodes || "N/A"}\n`;
      detailsMessage += `🖼️ *Image*: ${result.image || "N/A"}\n\n`;

      // Episode ලැයිස්තුවක් තියෙනවා නම් විතරක් පෙන්වන්න සකස් කිරීම
      if (episodeList && Array.isArray(episodeList) && episodeList.length > 0) {
        detailsMessage += "🎬 *Episodes* 🎬\n\n";
        episodeList.forEach((episode, index) => {
          detailsMessage += `📺 Episode ${episode.episode || index + 1} - 🔗 episode.php?${episode.url}\n`;
        });
      } else {
        detailsMessage += "❌ *No episodes found for this anime.*\n";
      }

      // Sending the anime details with newsletter context
      await robin.sendMessage(
        from,
        {
          text: detailsMessage,
          contextInfo: newsletterContext
        },
        { quoted: mek }
      );

    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
