const { cmd } = require("../command");
const { search, getep, dl } = require("darksadasyt-anime");
const axios = require("axios");

cmd(
  {
    pattern: "anime",
    alias: ["animesearch", "animes"],
    react: "🎭",
    desc: "Search Anime and Get Episode Links easily.",
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
      // JID එක සඳහා ආරක්ෂිතව String අගයක් ලබා ගැනීම (Crashes වැළැක්වීමට)
      const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));

      // 1. පරිශීලකයා නිවැරදි ඇනිමේ නමක් ලබා දී ඇත්දැයි බැලීම
      if (!q) return reply("⚠️ *Please provide an anime name!* 🎭");

      // DENETH-MD සඳහා සකස් කළ Newsletter Context සැකසුම්
      const newsletterContext = {
        mentionedJid: [sender],
        forwardingScore: 1000,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363292876277898@newsletter",
          newsletterName: "𝐃𝐄𝐍𝐄𝐓𝐇-𝐌𝐃",
          serverMessageId: 143,
        },
      };

      // 2. ඇනිමේ එක යූටියුබ්/වෙබ් අඩවි හරහා සෙවීම
      const results = await search(q);
      if (!results || results.length === 0) {
        return reply("❌ *No anime found with that name!*");
      }

      let animeList = "🎬 *DENETH-MD Anime Search Results* 🎬\n\nUse `.andl <link>` to download episodes\n\n";
      results.forEach((anime, index) => {
        animeList += `${index + 1}. ${anime.title}\n🔗 *Link:* ${anime.link}\n\n`;
      });

      // සෙවුම් ප්‍රතිඵල ලැයිස්තුව චැට් එකට යැවීම
      await robin.sendMessage(
        targetJid,
        {
          text: animeList.trim(),
          contextInfo: newsletterContext,
        },
        { quoted: mek }
      );

      // ලැබුණු පළමු ප්‍රතිඵලය පදනම් කරගෙන එපිසෝඩ් (Episodes) දත්ත ලබා ගැනීම
      const animeLink = results[0].link;
      const baseUrl = new URL(animeLink).origin;

      const episodeData = await getep(animeLink);
      if (!episodeData || (!episodeData.result && !episodeData.results)) {
        return reply("❌ *Could not retrieve episode data.*");
      }
      
      const title = episodeData.result ? episodeData.result.title : "Anime Episodes";
      let episodeList = `🎬 *Episodes for:* ${title} 🎬\n\n`;
      
      const episodes = episodeData.results || episodeData.result.episodes;
      episodes.forEach((episode) => {
        const fullEpisodeUrl = new URL(episode.url, baseUrl).href;
        episodeList += `📺 Episode ${episode.episode} - 🔗 ${fullEpisodeUrl}\n`;
      });

      // එපිසෝඩ් ලැයිස්තුව චැට් එකට යැවීම
      await robin.sendMessage(
        targetJid,
        {
          text: episodeList.trim(),
          contextInfo: newsletterContext,
        },
        { quoted: mek }
      );
      
    } catch (e) {
      console.error(e);
      reply(`❌ *Error:* ${e.message}`);
    }
  }
);
