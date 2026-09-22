const { cmd, commands } = require("../command");
const config = require("../config");

cmd(
  {
    pattern: "menu",
    alias: ["getmenu", "allmenu"],
    react: "📔",
    desc: "Get advanced category selection menu",
    category: "main",
    filename: __filename,
  },

  async (robin, mek, m, { from, sender, reply }) => {
    try {
      const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("@whiskeysockets/baileys");

      // 📋 ඔයා එවපු ස්ක්‍රීන්ෂොට් එකේ තිබුණු Categories ඔක්කොම මෙතැනට ඇතුළත් කළා
      const sections = [
        {
          title: "📋 MENU CATEGORIES",
          rows: [
            { title: "AI MENU 🤖", rowId: ".aimenu", description: "AI commands and tools" },
            { title: "ANIME MENU 🎎", rowId: ".animemenu", description: "Anime images and wallpapers" },
            { title: "REACTION MENU 💫", rowId: ".reactionmenu", description: "Fun text reactions" },
            { title: "CONVERT MENU 🔄", rowId: ".convertmenu", description: "Convert tools (Sticker, Audio)" },
            { title: "FUN MENU 😎", rowId: ".funmenu", description: "Fun & games commands" },
            { title: "DOWNLOAD MENU 📥", rowId: ".downloadmenu", description: "Download tools (FB, YT, TikTok)" }
          ]
        }
      ];

      const mediaMessage = await prepareWAMessageMedia(
        { image: { url: "https://ibb.co" } }, 
        { upload: robin.waUploadToServer }
      );

      const luxalgoText = `╭━━━〔 *LUXALGO-MD* 〕━━━┈⊷
┃
┃👋 *Hello User*
┃ *Welcome to LUXALGO-MD*
┃
┃⏳ *Please select a category from the*
┃ *list below to view commands.* ⬇️
┃
╰━━━━━━━━━━━━━━━━━━━┈⊷`;

      const msg = generateWAMessageFromContent(from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.fromObject({ text: luxalgoText }),
              footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "⚡ LUXALGO-MD" }),
              header: proto.Message.InteractiveMessage.Header.fromObject({
                hasMediaAttachment: true,
                imageMessage: mediaMessage.imageMessage
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [
                  {
                    "name": "single_select",
                    "buttonParamsJson": JSON.stringify({
                      "title": "📋 OPEN MENU",
                      "sections": sections
                    })
                  }
                ]
              }),
              contextInfo: { mentionedJid: sender ? [sender] : [], isForwarded: true }
            })
          }
        }
      }, { userJid: robin.user.jid, quoted: mek });

      await robin.relayMessage(from, msg.message, { messageId: msg.key.id });

    } catch (e) {
      console.error("MENU ERROR:", e);
      reply(`❌ Menu Error\n\n${e.message || e}`);
    }
  }
);
