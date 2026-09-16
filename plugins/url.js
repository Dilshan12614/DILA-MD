const { cmd } = require('../command');
const axios = require('axios');

// Command to shorten any long URL
cmd({
    pattern: "short",
    alias: ["url", "tinyurl"],
    desc: "Shorten a long URL using TinyURL",
    category: "converter",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, q, reply }) => {
    try {
        if (!q) return reply("*Please provide a long URL!* \nExample: `.short https://example.com`");
        
        const response = await axios.get(`https://tinyurl.com{encodeURIComponent(q)}`);
        if (response.data) {
            return reply(`*🔗 Shortened URL:* \n${response.data}`);
        } else {
            return reply("*Failed to shorten the URL. Try again later!*");
        }
    } catch (e) {
        console.error(e);
        reply("*An error occurred while processing your request!*");
    }
});

// Command to get direct media/image URL if replying to an image/video
cmd({
    pattern: "imgurl",
    alias: ["tourl", "mediaurl"],
    desc: "Upload replied media to Catbox/Telegraph and get link",
    category: "tools",
    react: "📤",
    filename: __filename
}, async (conn, mek, m, { from, quoted, reply }) => {
    try {
        if (!quoted || !quoted.message) return reply("*Please reply to an image or video!*");
        
        // Check if quoted message has media
        const mime = quoted.mtype || '';
        if (!mime.includes('image') && !mime.includes('video') && !mime.includes('audio')) {
            return reply("*Please reply to a valid image, video, or audio file!*");
        }

        reply("*Uploading media to cloud...*");
        const mediaBuffer = await quoted.download();
        
        // Using Catbox via FormData or simple upload API if available
        const FormData = require('form-data');
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', mediaBuffer, { filename: 'deneth_media.' + mime.split('/')[1] });

        const uploadRes = await axios.post('https://catbox.moe', form, {
            headers: { ...form.getHeaders() }
        });

        if (uploadRes.data) {
            return reply(`*🚀 Direct Media URL:* \n${uploadRes.data.trim()}`);
        } else {
            return reply("*Upload failed!*");
        }
    } catch (e) {
        console.error(e);
        reply(`*Error:* ${e.message}`);
    }
});
