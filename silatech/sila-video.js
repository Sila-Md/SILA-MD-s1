// silatech/video.js
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "video",
    alias: ["ytmp4", "mp4", "ytv", "vid", "v", "vide", "videos", "ytvi", "ytvid", "searchyt", "download", "get"],
    react: "🎬",
    desc: "Download YouTube MP4 video",
    category: "download",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const text = args.join(" ");

    await conn.sendMessage(from, { react: { text: "🎬", key: mek.key } });

    if (!text) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝚅𝙸𝙳𝙴𝙾 🐢 〕━━┈⊷*
*┃🐢│ • 🎬 to download any video*
*┃🐢│ • 📝 type: .video video name*
*┃🐢│ • 📝 example: .video lucifer*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        const search = await yts(text);
        if (!search.videos.length) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝚅𝙸𝙳𝙴𝙾 🐢 〕━━┈⊷*
*┃🐢│ • ❌ no video found for "${text}"*
*┃🐢│ • 🔄 please try different name*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }

        const data = search.videos[0];
        const ytUrl = data.url;

        // API call - replace APIKEY with your actual key
        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.media?.video_url) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝚅𝙸𝙳𝙴𝙾 🐢 〕━━┈⊷*
*┃🐢│ • ❌ video download failed*
*┃🐢│ • 🔄 please try again*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }

        const result = apiRes.result.media;

        const caption = `*╭━━〔 🐢 𝚅𝙸𝙳𝙴𝙾 🐢 〕━━┈⊷*
*┃🐢│ • 🎬 title: ${data.title}*
*┃🐢│ • 👁️ views: ${data.views}*
*┃🐢│ • ⏱️ time: ${data.timestamp}*
*┃🐢│ • 🔗 link: ${data.url}*
*╰━━━━━━━━━━━━━━━┈⊷*

*📋 options*
*┌─────────────────────┈⊷*
*│ 1️⃣ simple video*
*│ 2️⃣ file video*
*└─────────────────────┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        const sentMsg = await conn.sendMessage(from, { 
            image: { url: result.thumbnail }, 
            caption: caption,
            contextInfo: conn.forwardContext
        });

        const messageID = sentMsg.key.id;

        // Create a one-time listener for reply
        const replyHandler = (msgData) => {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message) return;

            const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
            const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
            const senderID = receivedMsg.key.remoteJid;

            if (isReplyToBot && senderID === from) {
                // Remove listener after receiving reply
                conn.ev.off("messages.upsert", replyHandler);

                switch (receivedText.trim()) {
                    case "1":
                        conn.sendMessage(from, { 
                            video: { url: result.video_url }, 
                            mimetype: "video/mp4" 
                        });
                        break;
                    case "2":
                        conn.sendMessage(from, { 
                            document: { url: result.video_url }, 
                            mimetype: "video/mp4", 
                            fileName: `${data.title}.mp4` 
                        });
                        break;
                    default:
                        conn.sendMessage(from, { 
                            text: `*╭━━〔 🐢 𝚅𝙸𝙳𝙴𝙾 🐢 〕━━┈⊷*
*┃🐢│ • ❌ please reply with 1 or 2*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                            contextInfo: conn.forwardContext
                        });
                }
            }
        };

        conn.ev.on("messages.upsert", replyHandler);

        // Auto remove listener after 60 seconds
        setTimeout(() => {
            conn.ev.off("messages.upsert", replyHandler);
        }, 60000);

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("Video download error:", error);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        // Error without box style - plain text only
        await conn.sendMessage(from, {
            text: `❌ video download failed. please try again.`
        });
    }
});
