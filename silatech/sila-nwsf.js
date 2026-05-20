// silatech/beauty.js
const axios = require('axios');

// Country flags and names
const countryData = {
    china: { flag: '🇨🇳', name: 'China', pattern: 'china' },
    indonesia: { flag: '🇮🇩', name: 'Indonesia', pattern: 'indonesia' },
    japan: { flag: '🇯🇵', name: 'Japan', pattern: 'japan' },
    korea: { flag: '🇰🇷', name: 'Korea', pattern: 'korea' },
    thailand: { flag: '🇹🇭', name: 'Thailand', pattern: 'thailand' }
};

// Command for China
cmd({
    pattern: "china",
    alias: ["chinese", "cn"],
    react: "🇨🇳",
    desc: "Get random Chinese beauty image",
    category: "nsfw",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "🇨🇳", key: mek.key } });
    
    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/r/cecan/china`, {
            timeout: 30000,
            responseType: 'arraybuffer'
        });
        
        if (!response.data) throw new Error('No response from API');

        const caption = `*╭━━〔 🐢 𝙲𝙷𝙸𝙽𝙴𝚂𝙴 𝙱𝙴𝙰𝚄𝚃𝚈 🐢 〕━━┈⊷*
*┃🐢│ • 🇨🇳 random chinese beauty*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: caption,
            contextInfo: conn.forwardContext
        });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error('China Beauty Error:', e);
        await conn.sendMessage(from, {
            text: `❌ failed to fetch image

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// Command for Indonesia
cmd({
    pattern: "indonesia",
    alias: ["indo", "id"],
    react: "🇮🇩",
    desc: "Get random Indonesian beauty image",
    category: "nsfw",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "🇮🇩", key: mek.key } });
    
    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/r/cecan/indonesia`, {
            timeout: 30000,
            responseType: 'arraybuffer'
        });
        
        if (!response.data) throw new Error('No response from API');

        const caption = `*╭━━〔 🐢 𝙸𝙽𝙳𝙾𝙽𝙴𝚂𝙸𝙰𝙽 𝙱𝙴𝙰𝚄𝚃𝚈 🐢 〕━━┈⊷*
*┃🐢│ • 🇮🇩 random indonesian beauty*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: caption,
            contextInfo: conn.forwardContext
        });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error('Indonesia Beauty Error:', e);
        await conn.sendMessage(from, {
            text: `❌ failed to fetch image

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// Command for Japan
cmd({
    pattern: "japan",
    alias: ["japanese", "jp"],
    react: "🇯🇵",
    desc: "Get random Japanese beauty image",
    category: "nsfw",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "🇯🇵", key: mek.key } });
    
    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/r/cecan/japan`, {
            timeout: 30000,
            responseType: 'arraybuffer'
        });
        
        if (!response.data) throw new Error('No response from API');

        const caption = `*╭━━〔 🐢 𝙹𝙰𝙿𝙰𝙽𝙴𝚂𝙴 𝙱𝙴𝙰𝚄𝚃𝚈 🐢 〕━━┈⊷*
*┃🐢│ • 🇯🇵 random japanese beauty*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: caption,
            contextInfo: conn.forwardContext
        });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error('Japan Beauty Error:', e);
        await conn.sendMessage(from, {
            text: `❌ failed to fetch image

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// Command for Korea
cmd({
    pattern: "korea",
    alias: ["korean", "kr"],
    react: "🇰🇷",
    desc: "Get random Korean beauty image",
    category: "nsfw",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "🇰🇷", key: mek.key } });
    
    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/r/cecan/korea`, {
            timeout: 30000,
            responseType: 'arraybuffer'
        });
        
        if (!response.data) throw new Error('No response from API');

        const caption = `*╭━━〔 🐢 𝙺𝙾𝚁𝙴𝙰𝙽 𝙱𝙴𝙰𝚄𝚃𝚈 🐢 〕━━┈⊷*
*┃🐢│ • 🇰🇷 random korean beauty*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: caption,
            contextInfo: conn.forwardContext
        });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error('Korea Beauty Error:', e);
        await conn.sendMessage(from, {
            text: `❌ failed to fetch image

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// Command for Thailand
cmd({
    pattern: "thailand",
    alias: ["thai", "th"],
    react: "🇹🇭",
    desc: "Get random Thai beauty image",
    category: "nsfw",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    await conn.sendMessage(from, { react: { text: "🇹🇭", key: mek.key } });
    
    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/r/cecan/thailand`, {
            timeout: 30000,
            responseType: 'arraybuffer'
        });
        
        if (!response.data) throw new Error('No response from API');

        const caption = `*╭━━〔 🐢 𝚃𝙷𝙰𝙸 𝙱𝙴𝙰𝚄𝚃𝚈 🐢 〕━━┈⊷*
*┃🐢│ • 🇹🇭 random thai beauty*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: caption,
            contextInfo: conn.forwardContext
        });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error('Thailand Beauty Error:', e);
        await conn.sendMessage(from, {
            text: `❌ failed to fetch image

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// Main beauty command (with country parameter)
cmd({
    pattern: "beauty",
    alias: [],
    react: "😍",
    desc: "Get random beauty image by country",
    category: "nsfw",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ")?.toLowerCase();
    
    await conn.sendMessage(from, { react: { text: "😍", key: mek.key } });
    
    if (!q) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙱𝙴𝙰𝚄𝚃𝚈 🐢 〕━━┈⊷*
*┃🐢│ • 📝 usage: .beauty <country>*
*┃🐢│ • 📝 available: china, indonesia, japan, korea, thailand*
*┃🐢│ • 📝 example: .beauty korea*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const validCountries = ['china', 'indonesia', 'japan', 'korea', 'thailand'];
    if (!validCountries.includes(q)) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙱𝙴𝙰𝚄𝚃𝚈 🐢 〕━━┈⊷*
*┃🐢│ • ❌ invalid country: ${q}*
*┃🐢│ • 📝 available: ${validCountries.join(', ')}*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/r/cecan/${q}`, {
            timeout: 30000,
            responseType: 'arraybuffer'
        });
        
        if (!response.data) throw new Error('No response from API');

        const countryNames = {
            china: 'Chinese', indonesia: 'Indonesian', japan: 'Japanese', 
            korea: 'Korean', thailand: 'Thai'
        };
        const flags = {
            china: '🇨🇳', indonesia: '🇮🇩', japan: '🇯🇵', 
            korea: '🇰🇷', thailand: '🇹🇭'
        };

        const caption = `*╭━━〔 🐢 ${countryNames[q].toUpperCase()} 𝙱𝙴𝙰𝚄𝚃𝚈 🐢 〕━━┈⊷*
*┃🐢│ • ${flags[q]} random ${countryNames[q].toLowerCase()} beauty*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: caption,
            contextInfo: conn.forwardContext
        });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error('Beauty Error:', e);
        await conn.sendMessage(from, {
            text: `❌ failed to fetch image

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});