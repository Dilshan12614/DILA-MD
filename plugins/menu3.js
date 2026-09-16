const { cmd, commands } = require("../command");
const config = require("../config");

cmd(
  {
    pattern: "menu3",
    alias: ["getmenu3"],
    react: "📔",
    desc: "Get force interactive block message welcome menu",
    category: "main",
    filename: __filename,
  },

  async (conn, mek, m, { from, sender, reply }) => {
    try {

      // =================================================================
      // FORCE INTERACTIVE STRUCTURE (NO BUTTONS, SHOWS VERSION ERROR)
      // =================================================================
      const { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");

      const msg = generateWAMessageFromContent(from, {
          viewOnceMessage: {
              message: {
                  messageContextInfo: {
                      deviceListMetadata: {},
                      deviceListMetadataVersion: 2
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                      body: proto.Message.InteractiveMessage.Body.fromObject({
                          text: "Hello welcome to DENETH-MD" // 👈 ඔයා ඉල්ලපු ප්‍රධාන වැකිය පමණක් ඇතුළත් කළා
                      }),
                      footer: proto.Message.InteractiveMessage.Footer.fromObject({
                          text: "© Powered By Deneth MD"
                      }),
                      header: proto.Message.InteractiveMessage.Header.fromObject({
                          title: "✨ DENETH MD SYSTEM ✨",
                          hasMediaAttachment: false
                      }),
                      carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                          cards: [
                              proto.Message.InteractiveMessage.fromObject({
                                  body: proto.Message.InteractiveMessage.Body.fromObject({ text: "" }),
                                  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                      buttons: [] // බටන්ස් පෙනෙන්න නැති වෙන්න හිස්ව තැබුවා
                                  })
                              })
                          ]
                      }),
                      contextInfo: {
                          mentionedJid: sender ? [sender] : [],
                          forwardingScore: 1000,
                          isForwarded: true,
                          forwardedNewsletterMessageInfo: {
                              newsletterJid: "120363429118791328@newsletter",
                              newsletterName: "DENETH 𝐌𝐃",
                              serverMessageId: 143
                          }
                      }
                  })
              }
          }
      }, { userJid: conn.user.jid, quoted: mek }); // conn ලෙස නිවැරදි කර ඇත

      // මැසේජ් එක වට්ස්ඇප් වෙත බලෙන් යැවීම
      await conn.relayMessage(from, msg.message, { messageId: msg.key.id }); // conn ලෙස නිවැරදි කර ඇත

    } catch (e) {
      console.error("MENU3 ERROR:", e);
      reply(`❌ Menu3 Error\n\n${e.message || e}`);
    }
  }
);
