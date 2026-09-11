const { cmd } = require('../command');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const TEMP_DIR = path.join(__dirname, '../temp');

if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function runYtDlp(args) {
    return new Promise((resolve, reject) => {
        execFile('yt-dlp', args, {
            timeout: 180000,
            maxBuffer: 1024 * 1024 * 10
        }, (error, stdout, stderr) => {
            if (error) {
                console.error('yt-dlp error:', stderr);
                return reject(error);
            }

            resolve(stdout);
        });
    });
}

cmd({
    pattern: "song",
    alias: ["play", "music"],
    desc: "Download YouTube song as audio",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, {
    from,
    q,
    reply
}) => {

    let outputFile = null;

    try {

        if (!q) {
            return reply(
`🎵 *DILA-MD SONG*

╭━━━━━━━━━━━━━━━━━━╮
┃ 🎧 *Usage*
┃ .song <song name>
┃
┃ 🎵 *Example*
┃ .song Alan Walker Faded
╰━━━━━━━━━━━━━━━━━━╯`
            );
        }

        await reply("🔎 *Searching YouTube...*");

        const search = await yts(q);

        if (!search.videos || !search.videos.length) {
            return reply("❌ Song එක හොයාගන්න බැරි වුණා.");
        }

        const video = search.videos[0];

        const title = video.title;
        const url = video.url;
        const safeTitle = title
            .replace(/[\\/:*?"<>|]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 80);

        outputFile = path.join(
            TEMP_DIR,
            `${Date.now()}-${safeTitle}.mp3`
        );

        await reply(
`🎵 *DILA-MD SONG*

╭━━━━━━━━━━━━━━━━━━╮
┃ 🎶 *Title:* ${title}
┃ ⏱️ *Duration:* ${video.timestamp}
┃ 👤 *Channel:* ${video.author.name}
╰━━━━━━━━━━━━━━━━━━╯

⬇️ *Downloading audio...*`
        );

        /*
         * yt-dlp downloads the audio directly.
         * No Vreden API required.
         */

        await runYtDlp([
            '--no-playlist',
            '--extract-audio',
            '--audio-format', 'mp3',
            '--audio-quality', '192K',
            '--no-warnings',
            '--quiet',
            '-o', outputFile,
            url
        ]);

        if (!fs.existsSync(outputFile)) {
            throw new Error("MP3 file was not created.");
        }

        const stats = fs.statSync(outputFile);

        if (stats.size === 0) {
            throw new Error("Downloaded MP3 is empty.");
        }

        await reply("📤 *Sending audio...*");

        await conn.sendMessage(
            from,
            {
                audio: fs.readFileSync(outputFile),
                mimetype: 'audio/mpeg',
                fileName: `${safeTitle}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        title: title,
                        body: '🎵 DILA-MD',
                        sourceUrl: url,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            },
            {
                quoted: mek
            }
        );

        /*
         * Delete temporary file
         */
        try {
            fs.unlinkSync(outputFile);
        } catch (e) {}

    } catch (error) {

        console.error("SONG PLUGIN ERROR:", error);

        if (outputFile && fs.existsSync(outputFile)) {
            try {
                fs.unlinkSync(outputFile);
            } catch (e) {}
        }

        return reply(
`❌ *Song Download Error*

⚠️ ${error.message || "Unknown error"}

💡 Please try another song.`
        );
    }
});
