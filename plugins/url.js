const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');

cmd({
    pattern: "url",
    alias: ["tourl", "imgurl"],
    desc: "Upload replied image and get URL",
    category: "convert",
    react: "🔗",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {

    try {
        if (!quoted) {
            return reply("❌ Please reply to an image.");
        }

        const mime =
            quoted.mimetype ||
            quoted.msg?.mimetype ||
            "";

        if (!mime.startsWith("image/")) {
            return reply("❌ Please reply to an image.");
        }

        const buffer = await quoted.download();

        if (!buffer) {
            return reply("❌ Failed to download the image.");
        }

        const form = new FormData();

        form.append("file", buffer, {
            filename: "dila-md.jpg",
            contentType: mime
        });

        const { data } = await axios.post(
            "https://tmpfiles.org/api/v1/upload",
            form,
            {
                headers: form.getHeaders(),
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        if (!data || !data.data || !data.data.url) {
            return reply("❌ Upload failed.");
        }

        // tmpfiles.org gives /abc/file.jpg
        // Convert it to direct download URL
        const directUrl = data.data.url.replace(
            "https://tmpfiles.org/",
            "https://tmpfiles.org/dl/"
        );

        return reply(
`╭━━━〔 🔗 DILA-MD URL 〕━━━╮
┃
┃ ✅ *Image Uploaded!*
┃
┃ 🔗 *URL:*
┃ ${directUrl}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`
        );

    } catch (error) {
        console.error("URL Plugin Error:", error);
        return reply("❌ Upload failed. Please try again later.");
    }
});
