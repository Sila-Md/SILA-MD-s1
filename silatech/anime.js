// silatech/anime.js
const axios = require('axios');

// ===================== ANIME POPULAR =====================
cmd({
    pattern: "animepopular",
    alias: ["anipop", "popularanime"],
    react: "🔥",
    desc: "Get popular anime list",
    category: "anime"
},
async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    
    await conn.sendMessage(from, { react: { text: "🔥", key: mek.key } });
    
    try {
        const response = await axios.get('https://api.siputzx.my.id/api/anime/anichin-popular');
        
        if (!response.data?.status) throw new Error('Failed to fetch data');
        
        const data = response.data.data;
        
        let message = `*╭━━〔 🐢 𝙿𝙾𝙿𝚄𝙻𝙰𝚁 𝙰𝙽𝙸𝙼𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ⭐ weekly*
*╰━━━━━━━━━━━━━━━┈⊷*

`;
        
        // Weekly
        data.weekly.forEach((item, i) => {
            message += `*${i+1}. ${item.title}*\n`;
            if (item.genres) message += `🎭 genres: ${item.genres.join(', ')}\n`;
            if (item.rating) message += `⭐ rating: ${item.rating}\n`;
            message += `\n`;
        });
        
        message += `> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
        
        await conn.sendMessage(from, { text: message, contextInfo: conn.forwardContext });
        
    } catch (e) {
        await conn.sendMessage(from, { 
            text: `❌ error: ${e.message}

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }
});

// ===================== ANIME DETAIL =====================
cmd({
    pattern: "animatedetail",
    alias: ["anidetail", "animeinfo"],
    react: "ℹ️",
    desc: "Get anime details from URL",
    category: "anime"
},
async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ");
    
    await conn.sendMessage(from, { react: { text: "ℹ️", key: mek.key } });
    
    if (!q) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙰𝙽𝙸𝙼𝙴 𝙳𝙴𝚃𝙰𝙸𝙻 🐢 〕━━┈⊷*
*┃🐢│ • 📝 please provide an anime url*
*┃🐢│ • 📝 example: .animatedetail https://anichin.cafe/...*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/anime/anichin-detail?url=${encodeURIComponent(q)}`);
        
        if (!response.data?.status) throw new Error('Failed to fetch details');
        
        const data = response.data.data;
        
        let message = `*╭━━〔 🐢 𝙰𝙽𝙸𝙼𝙴 𝙳𝙴𝚃𝙰𝙸𝙻 🐢 〕━━┈⊷*
*┃🐢│ • 📺 title: ${data.title}*
`;
        if (data.alternativeTitles) message += `*┃🐢│ • 📌 alt: ${data.alternativeTitles}*\n`;
        if (data.rating) message += `*┃🐢│ • ⭐ rating: ${data.rating}*\n`;
        if (data.status) message += `*┃🐢│ • 📊 status: ${data.status}*\n`;
        if (data.type) message += `*┃🐢│ • 🎬 type: ${data.type}*\n`;
        if (data.country) message += `*┃🐢│ • 🌍 country: ${data.country}*\n`;
        if (data.network) message += `*┃🐢│ • 📡 network: ${data.network}*\n`;
        if (data.studio) message += `*┃🐢│ • 🎨 studio: ${data.studio}*\n`;
        if (data.released) message += `*┃🐢│ • 📅 released: ${data.released}*\n`;
        if (data.duration) message += `*┃🐢│ • ⏱️ duration: ${data.duration}*\n`;
        if (data.genres && data.genres.length) message += `*┃🐢│ • 🎭 genres: ${data.genres.join(', ')}*\n`;
        if (data.synopsis) message += `*┃🐢│ • 📝 synopsis:*\n${data.synopsis}\n`;
        
        message += `*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
        
        await conn.sendMessage(from, { text: message, contextInfo: conn.forwardContext });
        
    } catch (e) {
        await conn.sendMessage(from, { 
            text: `❌ error: ${e.message}

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }
});

// ===================== ANIME EPISODES =====================
cmd({
    pattern: "episodes",
    alias: ["aniep", "animeepisodes"],
    react: "📺",
    desc: "Get anime episodes list",
    category: "anime"
},
async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ");
    
    await conn.sendMessage(from, { react: { text: "📺", key: mek.key } });
    
    if (!q) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙰𝙽𝙸𝙼𝙴 𝙴𝙿𝙸𝚂𝙾𝙳𝙴𝚂 🐢 〕━━┈⊷*
*┃🐢│ • 📝 please provide an anime url*
*┃🐢│ • 📝 example: .episodes https://anichin.cafe/...*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/anime/anichin-episode?url=${encodeURIComponent(q)}`);
        
        if (!response.data?.status) throw new Error('Failed to fetch episodes');
        
        const episodes = response.data.data;
        
        let message = `*╭━━〔 🐢 𝙰𝙽𝙸𝙼𝙴 𝙴𝙿𝙸𝚂𝙾𝙳𝙴𝚂 🐢 〕━━┈⊷*
`;
        
        episodes.slice(0, 20).forEach((ep, i) => {
            message += `*┃🐢│ • ${i+1}. ${ep.title || `Episode ${ep.episode}`}*\n`;
        });
        
        if (episodes.length > 20) {
            message += `*┃🐢│ • ... and ${episodes.length - 20} more episodes*\n`;
        }
        
        message += `*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
        
        await conn.sendMessage(from, { text: message, contextInfo: conn.forwardContext });
        
    } catch (e) {
        await conn.sendMessage(from, { 
            text: `❌ error: ${e.message}

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }
});

// ===================== ANIME SEARCH =====================
cmd({
    pattern: "animesearch",
    alias: ["anisearch", "searchanime"],
    react: "🔍",
    desc: "Search for anime",
    category: "anime"
},
async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ");
    
    await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });
    
    if (!q) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝚂𝙴𝙰𝚁𝙲𝙷 𝙰𝙽𝙸𝙼𝙴 🐢 〕━━┈⊷*
*┃🐢│ • 📝 please provide search query*
*┃🐢│ • 📝 example: .animesearch naruto*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/anime/anichin-search?query=${encodeURIComponent(q)}`);
        
        if (!response.data?.status) throw new Error('No results found');
        
        const results = response.data.data;
        
        let message = `*╭━━〔 🐢 𝚂𝙴𝙰𝚁𝙲𝙷: ${q.toUpperCase()} 🐢 〕━━┈⊷*
`;
        
        results.slice(0, 10).forEach((item, i) => {
            message += `*┃🐢│ ${i+1}. ${item.title}*\n`;
            message += `*┃🐢│    type: ${item.type} | status: ${item.status}*\n`;
            message += `*┃🐢│    link: ${item.link}*\n\n`;
        });
        
        if (results.length > 10) {
            message += `*┃🐢│ ... and ${results.length - 10} more results*\n`;
        }
        
        message += `*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
        
        await conn.sendMessage(from, { text: message, contextInfo: conn.forwardContext });
        
    } catch (e) {
        await conn.sendMessage(from, { 
            text: `❌ error: ${e.message}

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }
});

// ===================== ANIME DOWNLOAD =====================
cmd({
    pattern: "animatedownload",
    alias: ["anidownload", "anidl"],
    react: "⬇️",
    desc: "Get anime download links",
    category: "anime"
},
async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ");
    
    await conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } });
    
    if (!q) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙰𝙽𝙸𝙼𝙴 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 🐢 〕━━┈⊷*
*┃🐢│ • 📝 please provide an episode url*
*┃🐢│ • 📝 example: .animatedownload https://anichin.cafe/...*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/anime/anichin-download?url=${encodeURIComponent(q)}`);
        
        if (!response.data?.status) throw new Error('No download links found');
        
        const downloads = response.data.data;
        
        let message = `*╭━━〔 🐢 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙻𝙸𝙽𝙺𝚂 🐢 〕━━┈⊷*
`;
        
        downloads.forEach(item => {
            message += `*┃🐢│ 📀 ${item.resolution}*\n`;
            item.links.forEach(link => {
                message += `*┃🐢│    • ${link.host}: ${link.link}*\n`;
            });
            message += `\n`;
        });
        
        message += `*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
        
        await conn.sendMessage(from, { text: message, contextInfo: conn.forwardContext });
        
    } catch (e) {
        await conn.sendMessage(from, { 
            text: `❌ error: ${e.message}

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }
});

// ===================== ANIME QUOTES =====================
cmd({
    pattern: "animequotes",
    alias: ["aniquote", "quoteanime"],
    react: "💬",
    desc: "Get random anime quotes",
    category: "anime"
},
async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ") || "fate";
    
    await conn.sendMessage(from, { react: { text: "💬", key: mek.key } });
    
    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/s/animequotes?query=${encodeURIComponent(q)}`);
        
        if (!response.data?.status) throw new Error('No quotes found');
        
        const quotes = response.data.data;
        
        let message = `*╭━━〔 🐢 𝙰𝙽𝙸𝙼𝙴 𝚀𝚄𝙾𝚃𝙴𝚂 🐢 〕━━┈⊷*
`;
        
        quotes.slice(0, 5).forEach((quote, i) => {
            message += `*┃🐢│ "${quote.quotes}"*\n`;
            message += `*┃🐢│ — ${quote.karakter} (${quote.anime})*\n`;
            if (quote.episode) message += `*┃🐢│    📺 ${quote.episode}*\n`;
            message += `\n`;
        });
        
        message += `*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
        
        await conn.sendMessage(from, { text: message, contextInfo: conn.forwardContext });
        
    } catch (e) {
        await conn.sendMessage(from, { 
            text: `❌ error: ${e.message}

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }
});
