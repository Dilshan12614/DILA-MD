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
  } = require('baileys-pro')
  
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
  
  setInterval(clearTempDir, 5 * 60 * 1000);
  
//======= 🌟 NEW SECURE DIRECT SESSION EXTRACTOR (PRABATH-MD UPDATED FIXED) 🌟 =======
const sessionFolder = path.join(__dirname, 'sessions');
if (!fs.existsSync(sessionFolder)) {
    fs.mkdirSync(sessionFolder, { recursive: true });
}

if (!fs.existsSync(path.join(sessionFolder, 'creds.json'))) {
    // 1. Config හෝ Environment Variables වල SESSION_ID එකක් නැත්නම් ඔබ ලබාදුන් ස්ථිර ID එක භාවිත කරයි
    let rawSession = config.SESSION_ID || process.env.SESSION_ID || "PRABATH-MD~stmYcPHJzekThLz";
    
    if (!rawSession) {
        console.log('❌ Please add your session to SESSION_ID env or config.js !!');
    } else {
        try {
            let cleanString = String(rawSession)
                .replace(/^PRABATH-MD~/, '') // PRABATH-MD prefix එක ඉවත් කරයි
                .replace(/^DILSHAN-MD;;;/, '')
                .replace(/^DILSHAN-MD;;/, '')
                .replace(/^DILSHAN-MD;/, '')
                .replace(/^NEXA-MD;;;/, '')
                .replace(/^DARK-SHADOW-MD;;;/, '')
                .replace(/^DARK-SHADOW-MD;;/, '')
                .replace(/^DARK-SHADOW-MD;/, '')
                .trim();
            
            // 1. කෙලින්ම JSON එකක් නම් එලෙසම සුරකියි
            if (cleanString.startsWith('{') && cleanString.endsWith('}')) {
                JSON.parse(cleanString);
                fs.writeFileSync(path.join(sessionFolder, 'creds.json'), cleanString);
                console.log("Session downloaded ✅ [Direct Raw JSON]");
            } else {
                // 2. Base64 කේතයක් නම් Decode කර සුරකියි
                const decryptedJson = Buffer.from(cleanString, 'base64').toString('utf-8');
                JSON.parse(decryptedJson); 
                fs.writeFileSync(path.join(sessionFolder, 'creds.json'), decryptedJson);
                console.log("Session downloaded ✅ [Base64 Decoded]");
            }
        } catch (e) {
            console.log("⚠️ Session Extraction Failed! Error: " + e.message);
            console.log("👉 Please delete old GitHub Secret and add the FULL code again.");
        }
    }
}
//===================================================================================

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
  
  async function connectToWA() {
  console.log("Connecting to WhatsApp ⏳️...");
  const { state, saveCreds } = await useMultiFileAuthState(sessionFolder)
  var { version } = await fetchLatestBaileysVersion()
  
  const conn = makeWASocket({
          logger: P({ level: 'silent' }),
          printQRInTerminal: false,
          browser: Browsers.macOS("Firefox"),
          syncFullHistory: false, 
          auth: state,
          version
          })
      
  conn.ev.on('connection.update', async (update) => {
  const { connection, lastDisconnect } = update
  if (connection === 'close') {
  if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
  connectToWA()
  } else {
  console.log("🚪 Logged out or connection hard-closed.");
  }
  } else if (connection === 'open') {
  console.log('🧬 Installing Plugins')
  const path = require('path');
  if (fs.existsSync("./plugins/")) {
      fs.readdirSync("./plugins/").forEach((plugin) => {
          if (path.extname(plugin).toLowerCase() == ".js") {
              try { require("./plugins/" + plugin); } catch(e) { console.log(`Error loading plugin ${plugin}:`, e.message); }
          }
      });
  }
  console.log('Plugins installed successful ✅')
  console.log('Bot connected to whatsapp ✅')
  
  let up = `*Hello There PRABATH-MD User! \ud83d\udc4b\ud83c\udffb* \n\n> Bot connected successfully!\n- *YOUR PREFIX:* = ${prefix}\n\n> © Powered BY PRABATH-MD \ud83d\udda4`;
  try {
      await conn.sendMessage(conn.user.id, { text: up });
  } catch(e) {
      console.log("Welcome message transmission trigger completed.");
  }
  }
  })
  conn.ev.on('creds.update', saveCreds)

  conn.ev.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update.message === null) {
        await AntiDelete(conn, updates).catch(() => null);
      }
    }
  });

  conn.ev.on('messages.upsert', async(mek) => {
    try {
        mek = mek.messages[0]
        if (!mek || !mek.message) return
        mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
        
        if (config.READ_MESSAGE === 'true') {
            await conn.readMessages([mek.key]).catch(() => null);
        }
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === "true"){
            await conn.readMessages([mek.key]).catch(() => null);
        }
        
        await saveMessage(mek).catch(() => null);
    } catch(err) {
        console.error("Upsert loop safety trigger:", err.message);
    }
  });
}

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => { connectToWA(); }, 2000);
