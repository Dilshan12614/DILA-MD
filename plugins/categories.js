const { cmd, commands } = require("../command");

// =================================================================
// 1. AI MENU COMMAND
// =================================================================
cmd({
    pattern: "aimenu",
    dontAddCommandList: true,
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const text = `🤖 *LUXALGO-MD AI COMMANDS* 🤖

.gpt <පෙළ> - Chat with ChatGPT AI
.ai <පෙළ> - Advanced AI Search
.imagine <පෙළ> - Generate AI Images

> *Powered by LUXALGO-MD* ⚡`;
    return reply(text);
});

// =================================================================
// 2. ANIME MENU COMMAND
// =================================================================
cmd({
    pattern: "animemenu",
    dontAddCommandList: true,
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const text = `🎎 *LUXALGO-MD ANIME COMMANDS* 🎎

.anime - Random Anime Images
.waifu - Get Random Waifu Photo
.neko - Get Random Neko Photo
.wallanime - Anime Wallpapers

> *Powered by LUXALGO-MD* ⚡`;
    return reply(text);
});

// =================================================================
// 3. REACTION MENU COMMAND
// =================================================================
cmd({
    pattern: "reactionmenu",
    dontAddCommandList: true,
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const text = `💫 *LUXALGO-MD REACTION COMMANDS* 💫

.react <emoji> - React to messages
.slap - Slap a user text reaction
.cry - Show crying animation reaction
.hug - Hug a friend reaction

> *Powered by LUXALGO-MD* ⚡`;
    return reply(text);
});

// =================================================================
// 4. CONVERT MENU COMMAND
// =================================================================
cmd({
    pattern: "convertmenu",
    dontAddCommandList: true,
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const text = `🔄 *LUXALGO-MD CONVERT COMMANDS* 🔄

.sticker - Photo to WhatsApp Sticker
.convert - Media file converter
.tomp3 - Video file to MP3 audio
.toimage - Sticker to normal Photo

> *Powered by LUXALGO-MD* ⚡`;
    return reply(text);
});

// =================================================================
// 5. FUN MENU COMMAND
// =================================================================
cmd({
    pattern: "funmenu",
    dontAddCommandList: true,
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const text = `😎 *LUXALGO-MD FUN & GAMES* 😎

.joke - Get a funny random joke
.fact - Get an interesting fact
.dare - Get a dare challenge game
.truth - Get a truth question game

> *Powered by LUXALGO-MD* ⚡`;
    return reply(text);
});

// =================================================================
// 6. DOWNLOAD MENU COMMAND
// =================================================================
cmd({
    pattern: "downloadmenu",
    dontAddCommandList: true,
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const text = `📥 *LUXALGO-MD DOWNLOAD COMMANDS* 📥

.fb <ලින්ක් එක> - Facebook Video Downloader
.yt <ලින්ක් එක> - YouTube Video/Audio Downloader
.tiktok <ලින්ක් එක> - TikTok No-Watermark Downloader
.ig <ලින්ක් එක> - Instagram Reels Downloader

> *Powered by LUXALGO-MD* ⚡`;
    return reply(text);
});
