const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { uploadToImgbb } = require('../lib/functions');

module.exports = {
    command: 'tourl',
    description: 'Convert image or video media into a URL link.',
    run: async (sock, message, args) =>  {
        let mediaSource = null;

        // 1. Identify the incoming message type
        const type = Object.keys(message.message || {});

        // 2. Check for replied (Quoted) messages
        const quotedMessage = message.msg?.contextInfo?.quotedMessage;
        const quotedType = quotedMessage ? Object.keys(quotedMessage) : null;

        // 3. Logic to detect images/videos from normal chats, quotes, or button clicks
        if (quotedMessage && /imageMessage|videoMessage/.test(quotedType)) {
            mediaSource = { message: quotedMessage };
        } else if (/imageMessage|videoMessage/.test(type)) {
            mediaSource = message;
        } else if (type === 'buttonsResponseMessage' || type === 'templateButtonReplyMessage') {
            // If a button was clicked, look for the original media inside contextInfo
            const contextInfo = message.message[type]?.contextInfo;
            if (contextInfo?.quotedMessage && /imageMessage|videoMessage/.test(Object.keys(contextInfo.quotedMessage))) {
                mediaSource = { message: contextInfo.quotedMessage };
            }
        }

        // 4. Return an error message if no media is found
        if (!mediaSource) {
            return message.reply('Please reply to an image/video, or send an image/video with the caption `.tourl`');
        }

        try {
            await message.reply('Uploading your media, please wait...');
            const buffer = await downloadMediaMessage(mediaSource, 'buffer', {});
            const url = await uploadToImgbb(buffer);
            await message.reply(url);
        } catch (e) {
            console.error(e);
            await message.reply(`Failed to upload media. Error: ${e.message}`);
        }
    }
};
