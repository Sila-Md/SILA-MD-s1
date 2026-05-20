// silatech/animu.js
const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const webp = require('node-webpmux');
const crypto = require('crypto');

const ANIMU_BASE = 'https://api.some-random-api.com/animu';

function normalizeType(input) {
    const lower = (input || '').toLowerCase();
    if (lower === 'facepalm' || lower === 'face_palm') return 'face-palm';
    if (lower === 'quote' || lower === 'animu-quote' || lower === 'animuquote') return 'quote';
    return lower;
}

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

cmd({
    pattern: "animu",
    alias: ["anime"],
    react: "🎌",
    desc: "Anime actions",
    category: "fun",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ");
    const subArg = q ? q.split(' ')[0] : '';
    const sub = normalizeType(subArg);

    const supported = ['nom', 'poke', 'cry', 'kiss', 'pat', 'hug', 'wink', 'face-palm', 'quote'];

    await conn.sendMessage(from, { react: { text: "🎌", key: mek.key } });

    if (!sub) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙰𝙽𝙸𝙼𝚄 🐢 〕━━┈⊷*
*┃🐢│ • 📝 usage: .animu <type>*
*┃🐢│ • 🎌 types: ${supported.join(', ')}*
*┃🐢│ • 📝 example: .animu hug*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    if (!supported.includes(sub)) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙰𝙽𝙸𝙼𝚄 🐢 〕━━┈⊷*
*┃🐢│ • ❌ unsupported type: ${sub}*
*┃🐢│ • 🎌 try one of: ${supported.join(', ')}*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        await sendAnimu(conn, from, mek, sub);
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error('Animu error:', e);
        await conn.sendMessage(from, {
            text: `❌ an error occurred while fetching animu.

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});