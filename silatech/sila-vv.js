// silatech/vv.js
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

cmd({
    pattern: "vv",
    alias: ["antivv", "avv", "viewonce", "open", "openphoto", "openvideo", "vvphoto"],
    react: "😃",
    desc: "Retrieve quoted media (photo, video, audio) - Owner only",
    category: "owner",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const fromMe = mek.key.fromMe;
    const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    // Initial react 😃
    await conn.sendMessage(from, { react: { text: "😃", key: mek.key } });

    // Owner check - only bot owner can use this
    if (!fromMe) {
        await conn.sendMessage(from, { react: { text: "🔒", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝚅𝚅 🐢 〕━━┈⊷*
*┃🐢│ • 🔒 this command is owner only*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // If no quoted message
    if (!quoted) {
        await conn.sendMessage(from, { react: { text: "😊", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝚅𝚅 🐢 〕━━┈⊷*
*┃🐢│ • 📸 to open private photo/video/audio*
*┃🐢│ • 📝 reply to the media with .vv*
*╰━━━━━━━━━━━━━━━┈⊷*
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
*┃🐢│ • ❌ please reply to an image, video or audio*
*╰━━━━━━━━━━━━━━━┈⊷*
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
            text: `❌ failed to retrieve media. please try again.`
        });
    }
});
