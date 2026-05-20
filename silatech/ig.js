// silatech/ig.js
const { igdl } = require("ruhend-scraper");

cmd({
    pattern: "ig",
    alias: ["insta", "instagram", "reels", "igdl"],
    react: "📸",
    desc: "Download Instagram video/reel/image",
    category: "download",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ");
    
    // React
    await conn.sendMessage(from, { react: { text: "📸", key: mek.key } });

    // Check if Instagram link is provided
    if (!q) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙸𝙽𝚂𝚃𝙰𝙶𝚁𝙰𝙼 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • 📝 please provide an instagram link*
*┃🐢│ • 📝 usage: .ig instagram_url*
*┃🐢│ • 📝 example: .ig https://www.instagram.com/reel/xxx*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Validate URL
    if (!q.includes("instagram.com") && !q.includes("instagr.am")) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙸𝙽𝚂𝚃𝙰𝙶𝚁𝙰𝙼 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • ❌ please provide a valid instagram link*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        // Fetch media
        const downloadData = await igdl(q);
        
        if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
            return await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝙸𝙽𝚂𝚃𝙰𝙶𝚁𝙰𝙼 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • ❌ no media found. make sure the link is public*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }

        // Get the first media only (simplified)
        const media = downloadData.data[0];
        
        // Determine if it's video or image
        const isVideo = /\.(mp4|mov|avi|mkv|webm)/i.test(media.url) || 
                       media.type === 'video' || 
                       q.includes('/reel/') || 
                       q.includes('/tv/');

        // Send media with styled caption
        const mediaType = isVideo ? "video" : "image";
        const caption = `*╭━━〔 🐢 𝙸𝙽𝚂𝚃𝙰𝙶𝚁𝙰𝙼 🐢 〕━━┈⊷*
*┃🐢│ • 📸 instagram ${isVideo ? 'video' : 'image'}*
*┃🐢│ • ✅ downloaded successfully*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            [mediaType]: { url: media.url },
            caption: caption,
            mimetype: isVideo ? "video/mp4" : undefined,
            contextInfo: conn.forwardContext
        });

        // Final reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error('Instagram Command Error:', e);
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙸𝙽𝚂𝚃𝙰𝙶𝚁𝙰𝙼 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • ❌ failed to download media*
*┃🐢│ • ❌ error: ${e.message}*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});
