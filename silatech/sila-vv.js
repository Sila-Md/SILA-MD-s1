// silatech/vv.js
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

cmd({
    pattern: "vv",
    alias: ["antivv", "avv", "viewonce", "open", "openphoto", "openvideo", "vvphoto"],
    react: "😃",
    desc: "Retrieve quoted media (photo, video, audio)",
    category: "tools",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    // Bot website URL
    const BOT_URL = 'https://sila-mini.silatech.site/pair';

    // Initial react 😃
    await conn.sendMessage(from, { react: { text: "😃", key: mek.key } });

    // If no quoted message
    if (!quoted) {
        await conn.sendMessage(from, { react: { text: "😊", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝚅𝚅 🐢 〕━━┈⊷*
*┃🐢│ • 📸 𝚝𝚘 𝚘𝚙𝚎𝚗 𝚙𝚛𝚒𝚟𝚊𝚝𝚎 𝚙𝚑𝚘𝚝𝚘/𝚟𝚒𝚍𝚎𝚘/𝚊𝚞𝚍𝚒𝚘*
*┃🐢│ • 📝 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚝𝚑𝚎 𝚖𝚎𝚍𝚒𝚊 𝚠𝚒𝚝𝚑 .𝚟𝚟*
*╰━━━━━━━━━━━━━━━┈⊷*
𝚐𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: ${BOT_URL}
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Identify media type
    let type = Object.keys(quoted)[0];
    if (!["imageMessage", "videoMessage", "audioMessage"].includes(type)) {
        await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝚅𝚅 🐢 〕━━┈⊷*
*┃🐢│ • ❌ 𝚙𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊𝚗 𝚒𝚖𝚊𝚐𝚎, 𝚟𝚒𝚍𝚎𝚘 𝚘𝚛 𝚊𝚞𝚍𝚒𝚘*
*╰━━━━━━━━━━━━━━━┈⊷*
𝚐𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: ${BOT_URL}
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        // Download media
        const stream = await downloadContentFromMessage(quoted[type], type.replace("Message", ""));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        // Prepare message content
        let sendContent = {};
        if (type === "imageMessage") {
            sendContent = {
                image: buffer,
                caption: quoted[type]?.caption || "",
                mimetype: quoted[type]?.mimetype || "image/jpeg"
            };
        } else if (type === "videoMessage") {
            sendContent = {
                video: buffer,
                caption: quoted[type]?.caption || "",
                mimetype: quoted[type]?.mimetype || "video/mp4"
            };
        } else if (type === "audioMessage") {
            sendContent = {
                audio: buffer,
                mimetype: quoted[type]?.mimetype || "audio/mp4",
                ptt: quoted[type]?.ptt || false
            };
        }

        // Send back media
        await conn.sendMessage(from, sendContent);

        // React after success 😍
        await conn.sendMessage(from, { react: { text: "😍", key: mek.key } });

    } catch (error) {
        console.error("VV Error:", error);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        // Error without box style - plain text only
        await conn.sendMessage(from, {
            text: `❌ 𝚏𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚛𝚎𝚝𝚛𝚒𝚎𝚟𝚎 𝚖𝚎𝚍𝚒𝚊. 𝚙𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗.

𝚐𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: ${BOT_URL}

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`
        });
    }
});
