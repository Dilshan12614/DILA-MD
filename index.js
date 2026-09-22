const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    isJidBroadcast,
    getContentType,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    AnyMessageContent,
    prepareWAMessageMedia,
    areJidsSameUser,
    downloadContentFromMessage,
    MessageRetryMap,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateMessageID, makeInMemoryStore,
    jidDecode,
    fetchLatestBaileysVersion,
    Browsers
} = require('@whiskeysockets/baileys')
  
const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const StickersTypes = require('wa-sticker-formatter')
const util = require('util')
const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
const FileType = require('file-type');
const axios = require('axios')
const { File } = require('megajs')
const { fromBuffer } = require('file-type')
const bodyparser = require('body-parser')
const os = require('os')
const Crypto = require('crypto')
const path = require('path')
const prefix = config.PREFIX
  
const ownerNumber = ['94740534738']
  
const tempDir = path.join(os.tmpdir(), 'cache-temp')
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
}
  
const clearTempDir = () => {
    fs.readdir(tempDir, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(tempDir, file), err => {
                if (err) throw err;
            });
        }
    });
}
  
// Clear the temp directory every 5 minutes
setInterval(clearTempDir, 5 * 60 * 1000);
  
//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
    if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
    const sessdata = config.SESSION_ID.replace("LUXALGO=", '');
    const filer = File.fromURL(`https://mega.nz{sessdata}`)
    filer.download((err, data) => {
        if(err) throw err
        fs.writeFile(__dirname + '/sessions/creds.json', data, () => {
            console.log("Session downloaded ✅")
        })
    })
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
  
//=============================================
  
async function connectToWA() {
    console.log("Connecting to WhatsApp ⏳️...");
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
    var { version } = await fetchLatestBaileysVersion()
  
    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
    })
      
    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                connectToWA()
            }
        } else if (connection === 'open') {
            console.log('🧬 Installing Plugins')
            const path = require('path');
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() == ".js") {
                    require("./plugins/" + plugin);
                }
            });
            console.log('Plugins installed successful ✅')
            console.log('Bot connected to whatsapp ✅')
            
            let up = `*Hello There DARK-SHADOW-MD User! \ud83d\udc4b\ud83c\udffb* \n\n> Simple , Straight Forward But Loaded With Features \ud83c\udf8a, Meet DARK-SHADOW MD WhatsApp Bot.\n\n *Thanks for using DARK-SHADOW-MD \ud83d\udea9* \n\n> Join WhatsApp Channel :- ⤵️\n \nhttps://whatsapp.com\n\n- *YOUR PREFIX:* = ${prefix}\n\nDont forget to give star to repo ⬇️\n\nhttps://github.com\n\n> © Powered BY DARK-SHADOW \ud83d\udda4`;
            conn.sendMessage(conn.user.id, { image: { url: `https://telegra.ph` }, caption: up })
        }
    })
    conn.ev.on('creds.update', saveCreds)

    //==============================
    conn.ev.on('messages.update', async updates => {
        for (const update of updates) {
            if (update.update.message === null) {
                console.log("Delete Detected:", JSON.stringify(update, null, 2));
                await AntiDelete(conn, updates);
            }
        }
    });
    //============================== 
          
    //=============readstatus=======
    conn.ev.on('messages.upsert', async(mek) => {
        mek = mek.messages[0] // 🛠️ මෙතැන [0] නිවැරදිව ඇතුළත් කර ඇත
        if (!mek.message) return
        mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
            ? mek.message.ephemeralMessage.message 
            : mek.message;

        if (config.READ_MESSAGE === 'true') {
            await conn.readMessages([mek.key]);  
            console.log(`Marked message from ${mek.key.remoteJid} as read.`);
        }
        if(mek.message.viewOnceMessageV2)
            mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === "true"){
            await conn.readMessages([mek.key])
        }
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === "true"){
            const jawadlike = await conn.decodeJid(conn.user.id);
            const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '💚'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            await conn.sendMessage(mek.key.remoteJid, {
                react: { text: randomEmoji, key: mek.key } 
            }, { statusJidList: [mek.key.participant, jawadlike] });
        }                       
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REPLY === "true"){
            const user = mek.key.participant
            const text = `${config.AUTO_STATUS_MSG}`
            await conn.sendMessage(user, { text: text, react: { text: '💜', key: mek.key } }, { quoted: mek })
        }
        await Promise.all([
            saveMessage(mek),
        ]);

        const m = sms(conn, mek)
        const type = getContentType(mek.message)
        const content = JSON.stringify(mek.message)
        const from = mek.key.remoteJid
        const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
        
        body = (type === 'conversation') ? mek.message.conversation : 
               (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : 
               (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : 
               (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : 
               (type === 'buttonsResponseMessage') ? mek.message.buttonsResponseMessage.selectedButtonId : 
               (type === 'listResponseMessage') ? mek.message.listResponseMessage.singleSelectReply.selectedRowId : 
               (type === 'templateButtonReplyMessage') ? mek.message.templateButtonReplyMessage.selectedId : 
               (type === 'interactiveResponseMessage') ? (() => {
                   try {
                       const params = JSON.parse(mek.message.interactiveResponseMessage.nativeFlowRenderTargetTemplateNavChallengeMessage?.paramsJson || '{}');
                       return params.id || mek.message.interactiveResponseMessage.nativeFlowRenderTargetTemplateNavChallengeMessage?.paramsJson || '';
                   } catch {
                       return mek.message.interactiveResponseMessage.nativeFlowRenderTargetTemplateNavChallengeMessage?.paramsJson || '';
                   }
               })() : '';

        const isCmd = body.startsWith(prefix) || type === 'interactiveResponseMessage';
        
        let command;
        if (type === 'interactiveResponseMessage') {
            let cleanBody = body.startsWith(prefix) ? body.slice(prefix.length) : body;
            command = cleanBody.trim().split(' ').shift().toLowerCase();
        } else {
            command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        }

        const args = body && typeof body === 'string' ? body.trim().split(/ +/).slice(1) : [];
        const q = args.join(' ');

        const cmd = commands.find((c) => c.pattern === command) || commands.find((c) => c.alias && c.alias.includes(command));
        
        if (cmd) {
            const groupMetadata = from.endsWith('@g.us') ? await conn.groupMetadata(from).catch(() => null) : null;
            const groupName = groupMetadata ? groupMetadata.subject : '';
            const participants = groupMetadata ? groupMetadata.participants : [];
            const groupAdmins = groupMetadata ? getGroupAdmins(participants) : [];
            
            const isGroup = from.endsWith('@g.us');
            const sender = isGroup ? mek.key.participant : from;
      const senderNumber = sender.split('@')[0];
      const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
      const botNumber2 = conn.user.id;
      
      const isOwner = ownerNumber.includes(senderNumber) || mek.key.fromMe;
      const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
      const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
      const pushname = mek.pushName || 'User';

      // කමාන්ඩ් එක රන් කිරීම
      await cmd.function(conn, mek, m, {
          from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, 
          botNumber2, botNumber, pushname, isMe: mek.key.fromMe, isOwner, groupMetadata, 
          groupName, participants, groupAdmins, isBotAdmins, isAdmins, 
          reply: (text) => conn.sendMessage(from, { text: text }, { quoted: mek })
      });
  }
}); // messages.upsert සිදුවීම අවසන් කිරීම

} // connectToWA ශ්‍රිතය අවසන් කිරීම

connectToWA().catch(err => console.log("Main Connection Error:", err));
