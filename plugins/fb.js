const { cmd, commands } = require("../command");
const getFbVideoInfo = require("@xaviabot/fb-downloader");

cmd(
  {
    pattern: "fb",
    alias: ["facebook", "fbdl"],
    react: "🎬",
    desc: "Download Facebook Videos in HD/SD quality.",
    category: "download",
    filename: __filename,
  },
  async (
    danuwa,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      // JID එක සඳහා ආරක්ෂිතව String අගයක් ලබා ගැනීම
      const targetJid = typeof from === 'string' ? from : (mek.key.remoteJid || String(from));

      // 1. පරිශීලකයා නිවැරදි Facebook ලින්ක් එකක් ලබා දී ඇත්දැයි බැලීම
      if (!q) return reply("⚠️ *Please provide a valid Facebook video URL!*");

      const fbRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+/;
      if (!fbRegex.test(q)) {
        return reply("❌ *Invalid Facebook URL! Please check the link and try again.*");
      }

      // 2. වීඩියෝව බාගත කිරීම ආරම්භ කළ බව පෙන්වීමට පණිවිඩයක් යැවීම
      const loadingMsg = await danuwa.sendMessage(targetJid, { 
        text: `🎬 *DENETH-MD Fetching Your Facebook Video...*` 
      }, { quoted: mek });

      // 3. Facebook API එක හරහා දත්ත ලබා ගැනීම
      const result = await getFbVideoInfo(q);
      if (!result || (!result.sd && !result.hd)) {
        return await danuwa.sendMessage(targetJid, { 
          text: "❌ *Failed to download the video. The link might be private or broken.*", 
          edit: loadingMsg.key 
        });
      }

      const { title, sd, hd } = result;
      const bestQualityUrl = hd || sd;
      const qualityText = hd ? "HD Available" : "SD Quality";

      // 4. වීඩියෝවේ විස්තර ලස්සනට Facebook ඩවුන්ලෝඩර් එකකට ගැළපෙන ඉමෝජි සහිතව Format කිරීම
      let desc = `*💢 DENETH-MD FACEBOOK DOWNLOADER 💢*

🔹 *Title:* ${title || "Facebook Video"}
📥 *Quality:* ${qualityText}
🔗 *URL:* ${q}

> *Downloading video file... Please wait!* ⏳`;

      // විස්තර පත්‍රිකාව පෙන්වීම සහ කලින් ලෝඩින් මැසේජ් එක යාවත්කාලීන කිරීම
      await danuwa.sendMessage(targetJid, { text: `✅ *Video Found! Processing download...*` }, { edit: loadingMsg.key });

      // පින්තූරය සමඟ විස්තර පත්‍රිකාව යැවීම
      await danuwa.sendMessage(
        targetJid,
        { 
          image: { url: "https://github.com" }, 
          caption: desc 
        },
        { quoted: mek }
      );

      // 5. වට්සැප් එකට වීඩියෝව (Video File) සෘජුවම යැවීම
      await danuwa.sendMessage(
        targetJid,
        {
          video: { url: bestQualityUrl },
          caption: `*📥 Successfully Downloaded by DENETH-MD* 🚀`,
        },
        { quoted: mek }
      );

      // බාගත කිරීම අවසන් වූ පසු අවසාන පණිවිඩය යැවීම
      return await danuwa.sendMessage(targetJid, { 
        text: "✅ *Thank you for using DENETH-MD!*" 
      }, { edit: loadingMsg.key });

    } catch (e) {
      console.error(e);
      reply(`❌ *Error:* ${e.message || e} 😞`);
    }
  }
);
