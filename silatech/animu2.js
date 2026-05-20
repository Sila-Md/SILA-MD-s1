// silatech/animu.js
const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const webp = require('node-webpmux');
const crypto = require('crypto');

const ANIMU_BASE = 'https://api.some-random-api.com/animu';

async function sendAnimu(conn, chatId, message, type) {
    const endpoint = `${ANIMU_BASE}/${type}`;
    const res = await axios.get(endpoint);
    const data = res.data || {};

    async function convertMediaToSticker(mediaBuffer, isAnimated) {
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        const inputExt = isAnimated ? 'gif' : 'jpg';
        const input = path.join(tmpDir, `animu_${Date.now()}.${inputExt}`);
        const output = path.join(tmpDir, `animu_${Date.now()}.webp`);
        fs.writeFileSync(input, mediaBuffer);

        const ffmpegCmd = isAnimated 
            ? `ffmpeg -y -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,fps=15" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 60 -compression_level 6 "${output}"`
            : `ffmpeg -y -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${output}"`;

        await new Promise((resolve, reject) => {
            exec(ffmpegCmd, (err) => (err ? reject(err) : resolve()));
        });

        let webpBuffer = fs.readFileSync(output);

        const img = new webp.Image();
        await img.load(webpBuffer);

        const json = {
            'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
            'sticker-pack-name': 'Anime Stickers',
            'emojis': ['🎌']
        };
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
        const exif = Buffer.concat([exifAttr, jsonBuffer]);
        exif.writeUIntLE(jsonBuffer.length, 14, 4);
        img.exif = exif;

        const finalBuffer = await img.save(null);

        try { fs.unlinkSync(input); } catch {}
        try { fs.unlinkSync(output); } catch {}
        return finalBuffer;
    }

    if (data.link) {
        const link = data.link;
        const lower = link.toLowerCase();
        const isGifLink = lower.endsWith('.gif');
        const isImageLink = lower.match(/\.(jpg|jpeg|png|webp)$/);

        if (isGifLink || isImageLink) {
            try {
                const resp = await axios.get(link, {
                    responseType: 'arraybuffer',
                    timeout: 15000,
                    headers: { 'User-Agent': 'Mozilla/5.0' }
                });
                const mediaBuf = Buffer.from(resp.data);
                const stickerBuf = await convertMediaToSticker(mediaBuf, isGifLink);
                await conn.sendMessage(chatId, { sticker: stickerBuf }, { quoted: message });
                return;
            } catch (error) {
                console.error('Error converting media to sticker:', error);
            }
        }

        try {
            await conn.sendMessage(chatId, { image: { url: link }, caption: `anime: ${type}` }, { quoted: message });
            return;
        } catch {}
    }
    if (data.quote) {
        await conn.sendMessage(chatId, { text: data.quote }, { quoted: message });
        return;
    }

    await conn.sendMessage(chatId, { text: '❌ failed to fetch animu.' }, { quoted: message });
}

// ==================== COMMAND: NOM ====================
cmd({
    pattern: "nom",
    alias: ["eat"],
    react: "🍜",
    desc: "Anime nom/eat action",
    category: "fun",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "🍜", key: mek.key } });
    try {
        await sendAnimu(conn, from, mek, 'nom');
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, {
            text: `❌ failed to fetch nom

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== COMMAND: POKE ====================
cmd({
    pattern: "poke",
    alias: [],
    react: "👉",
    desc: "Anime poke action",
    category: "fun",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "👉", key: mek.key } });
    try {
        await sendAnimu(conn, from, mek, 'poke');
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, {
            text: `❌ failed to fetch poke

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== COMMAND: CRY ====================
cmd({
    pattern: "cry",
    alias: ["crying"],
    react: "😭",
    desc: "Anime cry action",
    category: "fun",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "😭", key: mek.key } });
    try {
        await sendAnimu(conn, from, mek, 'cry');
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, {
            text: `❌ failed to fetch cry

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== COMMAND: KISS ====================
cmd({
    pattern: "kiss",
    alias: ["muah"],
    react: "💋",
    desc: "Anime kiss action",
    category: "fun",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "💋", key: mek.key } });
    try {
        await sendAnimu(conn, from, mek, 'kiss');
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, {
            text: `❌ failed to fetch kiss

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== COMMAND: PAT ====================
cmd({
    pattern: "pat",
    alias: ["pet"],
    react: "🖐️",
    desc: "Anime pat action",
    category: "fun",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "🖐️", key: mek.key } });
    try {
        await sendAnimu(conn, from, mek, 'pat');
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, {
            text: `❌ failed to fetch pat

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== COMMAND: HUG ====================
cmd({
    pattern: "hug",
    alias: ["embrace"],
    react: "🤗",
    desc: "Anime hug action",
    category: "fun",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "🤗", key: mek.key } });
    try {
        await sendAnimu(conn, from, mek, 'hug');
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, {
            text: `❌ failed to fetch hug

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== COMMAND: WINK ====================
cmd({
    pattern: "wink",
    alias: [],
    react: "😉",
    desc: "Anime wink action",
    category: "fun",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "😉", key: mek.key } });
    try {
        await sendAnimu(conn, from, mek, 'wink');
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, {
            text: `❌ failed to fetch wink

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== COMMAND: FACEPALM ====================
cmd({
    pattern: "facepalm",
    alias: ["facepalm", "face_palm"],
    react: "🤦",
    desc: "Anime facepalm action",
    category: "fun",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "🤦", key: mek.key } });
    try {
        await sendAnimu(conn, from, mek, 'face-palm');
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, {
            text: `❌ failed to fetch facepalm

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== COMMAND: ANIME QUOTE ====================
cmd({
    pattern: "animequote",
    alias: ["animuquote", "quote"],
    react: "💬",
    desc: "Random anime quote",
    category: "fun",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "💬", key: mek.key } });
    try {
        await sendAnimu(conn, from, mek, 'quote');
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, {
            text: `❌ failed to fetch anime quote

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== MAIN COMMAND: ANIMU ====================
cmd({
    pattern: "animu",
    alias: ["anime"],
    react: "🎌",
    desc: "Anime actions (use with type)",
    category: "fun",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ");
    const supported = ['nom', 'poke', 'cry', 'kiss', 'pat', 'hug', 'wink', 'facepalm', 'quote'];

    await conn.sendMessage(from, { react: { text: "🎌", key: mek.key } });

    if (!q) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙰𝙽𝙸𝙼𝚄 🐢 〕━━┈⊷*
*┃🐢│ • 📝 usage: .animu <type>*
*┃🐢│ • 🎌 or use direct commands:*
*┃🐢│   .nom, .poke, .cry, .kiss*
*┃🐢│   .pat, .hug, .wink, .facepalm*
*┃🐢│   .animequote*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    let type = q.toLowerCase();
    if (type === 'facepalm' || type === 'face_palm') type = 'face-palm';
    if (type === 'quote' || type === 'animuquote') type = 'quote';

    if (!supported.includes(type)) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙰𝙽𝙸𝙼𝚄 🐢 〕━━┈⊷*
*┃🐢│ • ❌ unsupported type: ${type}*
*┃🐢│ • 🎌 try: ${supported.join(', ')}*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        await sendAnimu(conn, from, mek, type);
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        await conn.sendMessage(from, {
            text: `❌ an error occurred while fetching animu.

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});