// silatech/groupstatus.js
const baileys = require('@whiskeysockets/baileys');
const crypto = require('crypto');

cmd({
    pattern: "groupstatus",
    alias: ["gs", "groupstat", "statusgroup"],
    react: "🟢",
    desc: "Send a text or media status visible to all group members",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const q = args.join(' ');

    // 🧱 1. Restrict to group chats only
    if (!isGroup) {
        await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙶𝚁𝙾𝚄𝙿 𝚂𝚃𝙰𝚃𝚄𝚂 🐢 〕━━┈⊷*
*┃🐢│ • ❌ this command only works in groups*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Check if there's a quoted message with media
    const quotedMsg = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    let mediaBuffer = null;
    let mediaType = null;
    let mediaCaption = '';

    // Try to get media from quoted message
    if (quotedMsg) {
        if (quotedMsg.imageMessage) {
            mediaType = 'image';
            mediaCaption = quotedMsg.imageMessage.caption || '';
            const stream = await conn.downloadMediaMessage(mek.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage);
            mediaBuffer = await streamToBuffer(stream);
        } else if (quotedMsg.videoMessage) {
            mediaType = 'video';
            mediaCaption = quotedMsg.videoMessage.caption || '';
            const stream = await conn.downloadMediaMessage(mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage);
            mediaBuffer = await streamToBuffer(stream);
        }
    }

    // 🧩 2. Prepare group status content
    let content = {};
    
    if (mediaBuffer && mediaType) {
        if (mediaType === 'image') {
            content = {
                image: mediaBuffer,
                caption: q || mediaCaption || '📸 group photo update!',
            };
        } else if (mediaType === 'video') {
            content = {
                video: mediaBuffer,
                caption: q || mediaCaption || '🎬 group video update!',
            };
        }
    } else {
        if (!q) {
            await conn.sendMessage(from, { react: { text: "📜", key: mek.key } });
            return await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝙶𝚁𝙾𝚄𝙿 𝚂𝚃𝙰𝚃𝚄𝚂 🐢 〕━━┈⊷*
*┃🐢│ • 📝 use: .groupstatus <text>*
*┃🐢│ • 🖼️ or reply to an image/video*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }
        content = {
            text: q,
            backgroundColor: '#25D366'
        };
    }

    // 🧠 3. Send group status
    try {
        const statusMsg = await sendGroupStatus(conn, from, content);
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙶𝚁𝙾𝚄𝙿 𝚂𝚃𝙰𝚃𝚄𝚂 🐢 〕━━┈⊷*
*┃🐢│ • ✅ group status posted successfully!*
*┃🐢│ • ⏰ expires in 24 hours*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });

        // Auto delete after 24h
        setTimeout(async () => {
            try {
                await conn.sendMessage(from, { delete: statusMsg.key });
                console.log(`🕒 auto-deleted group status in ${from}`);
            } catch (e) {
                console.error('⚠️ auto-delete failed:', e);
            }
        }, 24 * 60 * 60 * 1000);

    } catch (err) {
        console.error('❌ failed to send group status:', err);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙶𝚁𝙾𝚄𝙿 𝚂𝚃𝙰𝚃𝚄𝚂 🐢 〕━━┈⊷*
*┃🐢│ • ❌ failed to send group status*
*┃🐢│ • 🔄 please try again*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }
});

/**
 * 🧩 Function: Convert stream to buffer
 */
async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

/**
 * 🧩 Function: Send Group Status (with optional media + auto expire)
 */
async function sendGroupStatus(client, jid, content) {
    try {
        const { backgroundColor } = content;
        delete content.backgroundColor;

        const inside = await baileys.generateWAMessageContent(content, {
            upload: client.waUploadToServer,
            backgroundColor
        });

        const messageSecret = crypto.randomBytes(32);
        const m = baileys.generateWAMessageFromContent(
            jid,
            {
                messageContextInfo: { messageSecret },
                groupStatusMessageV2: {
                    message: {
                        ...inside,
                        messageContextInfo: { messageSecret }
                    }
                }
            },
            {}
        );

        await client.relayMessage(jid, m.message, { messageId: m.key.id });
        return m;
    } catch (err) {
        console.error('❌ groupstatus error:', err);
        throw err;
    }
}
