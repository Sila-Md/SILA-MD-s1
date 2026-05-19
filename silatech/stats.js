// silatech/stats.js
cmd({
    pattern: "stats",
    alias: ["statistics", "botstats"],
    react: "📈",
    desc: "Show bot statistics",
    category: "utility",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const uptime = process.uptime();
    
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    let uptimeString = '';
    if (days > 0) uptimeString += `${days}𝚍 `;
    if (hours > 0) uptimeString += `${hours}𝚑 `;
    if (minutes > 0) uptimeString += `${minutes}𝚖 `;
    uptimeString += `${seconds}𝚜`;
    
    const memoryUsage = process.memoryUsage();
    const heapUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    const heapTotal = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
    const rss = (memoryUsage.rss / 1024 / 1024).toFixed(2);
    
    const cpuCores = require('os').cpus().length;
    const platform = require('os').platform();
    const nodeVersion = process.version;
    
    const defaultConfig = {
        RCD_IMAGE_PATH: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg'
    };
    
    const commandsCount = global.silaCommands?.size || 0;
    
    const statsMsg = `*╭━━〔 🐢 𝚂𝚃𝙰𝚃𝚂 🐢 〕━━┈⊷*
*┃🐢│ • 📊 𝚃𝙾𝚃𝙰𝙻 𝙲𝙼𝙳𝚂: ${commandsCount}*
*┃🐢│ • ⏱️ 𝚄𝙿𝚃𝙸𝙼𝙴: ${uptimeString}*
*┃🐢│ • 💾 𝙷𝙴𝙰𝙿: ${heapUsed}𝙼𝙱 / ${heapTotal}𝙼𝙱*
*┃🐢│ • 🖥️ 𝚁𝚂𝚂: ${rss}𝙼𝙱*
*┃🐢│ • 🧠 𝙲𝙿𝚄: ${cpuCores} 𝙲𝙾𝚁𝙴𝚂*
*┃🐢│ • 💻 𝙾𝚂: ${platform}*
*┃🐢│ • 🖥️ 𝙽𝙾𝙳𝙴: ${nodeVersion}*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
    
    await conn.sendMessage(from, { 
        image: { url: defaultConfig.RCD_IMAGE_PATH },
        caption: statsMsg,
        contextInfo: conn.forwardContext
    }, { quoted: conn.fkontak });
});
