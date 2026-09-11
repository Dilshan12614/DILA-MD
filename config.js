const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "DILSHAN-MD;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYUJidWhNRFQ0aVRld2UwWGFFRThBc3hwR2tJbmg0VE5zVXdlRm1yOVRFVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicXNZQVIzS3hGMlJKSldDZXhodjQ5WmxmK3NFVDBqd3lPTGFQSjNUTzFDZz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJnRDY3OElyNkEzc2IrUUZRaVJ4OW5mSy95WUJFdmthVFd5WWIxQWRmVm5vPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJWNDFHUUplbEo0RmpqT2JmY3MyREtmV1JBaXgyMG1vd1hrWW5BZngzMDNRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNBM2lFc2lmMXJYNzN2ZERSS2xLRDYyUVdEaThodGIyR3crWDZOKzFEVU09In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhEQUxBNVovd21qTmpBd2d3MTdhTEcwZVlEdTRZazZUdXFQZjZwNCtXVUE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMkZkYUtpcjdzaHppb0lzdUdocXZOSUFjUkhRK3EwK0tIY2VkblQvbGIwQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRlBCOTY3VkZyRHllS3A5RWltdWxxSnNrZ1dqcGhOQVR6TUxSQi8vTEdUWT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjZZQWIzWmUwNkc5ZjZTQmI0VVlaeEJWdHREbExLc09pcGtGb0oyWHF4WlI1SkRnK1l5ZlowSTVVZEVzc1JBbXZEUkwvclRKa2EwQVlIS0dremcrL0RBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MzMsImFkdlNlY3JldEtleSI6Im1xY04zTFRZbTF5RXpISDdrTk1YMDQ1NEZQNTl4R0xpU2s2dEwvUS94UXc9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjpmYWxzZSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0piTThPZ0ZFTXFPa2RVR0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IklVTUdReVQ3TDUvbFk4QjJWUkZjeXFPeTNLTU5TL0VqNjk2Wk1saVpKaWc9IiwiYWNjb3VudFNpZ25hdHVyZSI6IlAwNUFrN1p2dlNKY0dHWExYTGxyRXNsTkhZVThQUGZsWWN6ajE0QWNBWXFvU1Q1dmZpRk16ckgvQXRWU3pwQXhoclhVMWdOQWpaSTBzbXJ4VklrSEJBPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJJRkgydGgzb0YzTmI5YkI2Wkp3dW5ic09QcEliVTdXOERiZnl5UmI4cGllaHc4cmpKUFJLdG1GeTVwQWtSbXpwZHM4QmovV3F6WjRTelYxTkVZdU9CQT09In0sIm1lIjp7ImlkIjoiOTQ3NDI4NzY0ODI6MkBzLndoYXRzYXBwLm5ldCJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiI5NDc0Mjg3NjQ4MjoyQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlNGREJrTWsreStmNVdQQWRsVVJYTXFqc3R5akRVdnhJK3ZlbVRKWW1TWW8ifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBVUlFZ2dDIn0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc4OTE1MTA2Mn0=",
// add your Session Id 
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
// make true or false status auto seen
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true if you want auto reply on status 
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
// make true if you want auto reply on status 
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY DARK-SHADOW -MD 🤍*",
// set the auto reply massage on status reply  
PREFIX: process.env.PREFIX || ".",
// add your prifix for bot   
BOT_NAME: process.env.BOT_NAME || "DARK SHADOW-MD",
// add bot namw here for menu
STICKER_NAME: process.env.STICKER_NAME || "DARK-SHADOW-MD",
// type sticker pack name 
CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
// make this true for custum emoji react    
CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
// chose custom react emojis by yourself 
DELETE_LINKS: process.env.DELETE_LINKS || "false",
// automatic delete links witho remove member 
OWNER_NUMBER: process.env.OWNER_NUMBER || "94773416478",
// add your bot owner number
OWNER_NAME: process.env.OWNER_NAME || "DARK SHADOW",
// add bot owner name
DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴀʀᴋ ꜱʜᴀᴅᴏᴡ ᴍᴅ*",
// add bot owner name    
ALIVE_IMG: process.env.ALIVE_IMG || "https://telegra.ph/file/1ece2e0281513c05d20ee.jpg",
// add img for alive msg
LIVE_MSG: process.env.LIVE_MSG || "> HELLO I'AM *DARK-SHADOW-MD*⚡",
// add alive msg here 
READ_MESSAGE: process.env.READ_MESSAGE || "false",
// Turn true or false for automatic read msgs
AUTO_REACT: process.env.AUTO_REACT || "false",
// make this true or false for auto react on all msgs
ANTI_BAD: process.env.ANTI_BAD || "false",
// false or true for anti bad words  
MODE: process.env.MODE || "public",
// make bot public-private-inbox-group 
ANTI_LINK: process.env.ANTI_LINK || "false",
// make anti link true,false for groups 
AUTO_VOICE: process.env.AUTO_VOICE || "false",
// make true for send automatic voices
AUTO_STICKER: process.env.AUTO_STICKER || "false",
// make true for automatic stickers 
AUTO_REPLY: process.env.AUTO_REPLY || "false",
// make true or false automatic text reply 
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
// maks true for always online 
PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
// make false if want private mod
AUTO_TYPING: process.env.AUTO_TYPING || "false",
// true for automatic show typing   
READ_CMD: process.env.READ_CMD || "false",
// true if want mark commands as read 
DEV: process.env.DEV || "94773416478",
//replace with your whatsapp number        
ANTI_VV: process.env.ANTI_VV || "true",
// true for anti once view 
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "log", 
// change it to 'same' if you want to resend deleted message in same chat 
AUTO_RECORDING: process.env.AUTO_RECORDING || "false"
// make it true for auto recoding 
};
