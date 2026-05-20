// silatech/fb.js
const getFBInfo = require("@xaviabot/fb-downloader");

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdl", "fbvideo"],
    react: "📽️",
    desc: "Download Facebook video in HD",
    category: "download",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "📽️", key: mek.key } });

    // Check if Facebook link is provided
    if (!q) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • 📝 please provide a facebook video link*
*┃🐢│ • 📝 usage: .fb facebook_url*
*┃🐢│ • 📝 example: .fb https://fb.watch/xxx*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Validate URL
    if (!q.includes("facebook.com") && !q.includes("fb.watch")) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • ❌ please provide a valid facebook video link*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        // Fetch video info
        const videoData = await getFBInfo(q);

        if (!videoData || !videoData.sd) {
            return await conn.sendMessage(from, {
                text: `❌ failed to fetch video. the link might be private or invalid

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }

        // Use HD if available, otherwise use SD
        const videoUrl = videoData.hd || videoData.sd;
        const videoQuality = videoData.hd ? 'hd' : 'sd';
        const title = videoData.title || 'facebook video';

        // Send video with styled caption
        const caption = `*╭━━〔 🐢 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 🐢 〕━━┈⊷*
*┃🐢│ • 📽️ facebook video*
*┃🐢│ • 📹 quality: ${videoQuality}*
*┃🐢│ • 📝 title: ${title.substring(0, 50)}${title.length > 50 ? '...' : ''}*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: conn.forwardContext
        });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error('FB Command Error:', error);
        await conn.sendMessage(from, {
            text: `❌ failed to download video. please try again later.

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});