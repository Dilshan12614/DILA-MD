const { cmd } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed", "ms"],
    desc: "බොට්ගේ වේගය (Speed) පරීක්ෂා කිරීම.",
    category: "main",
    filename: __filename
},
async (conn, mek, from, options) => {
    try {
        // මැසේජ් එක ලැබුණු වෙලාව සහ දැන් වෙලාව අතර වෙනස බැලීම
        const startTime = Date.now();
        
        // මුලින්ම කුඩා මැසේජ් එකක් යවනවා
        const pingMsg = await conn.sendMessage(from, { text: '*Testing Speed... ⏳*' }, { quoted: mek });
        
        // මැසේජ් එක ගිය පසු ගතවූ කාලය ගණනය කිරීම
        const endTime = Date.now();
        const pingTime = endTime - startTime;

        // පරණ මැසේජ් එක වෙනස් කර (Edit) නියම Ping එක ලස්සනට පෙන්වීම
        await conn.sendMessage(from, { 
            text: `*DENETH-MD SPEED* 🚀\n\n⚡ *Ping:* \`${pingTime} ms\`\n📶 *Status:* \`Excellent\``,
            edit: pingMsg.key 
        });

    } catch (e) {
        console.log("Ping Command Error: ", e);
        await conn.sendMessage(from, { text: `❌ වැරදීමක් සිදුවුණා: ${e.message}` }, { quoted: mek });
    }
});
