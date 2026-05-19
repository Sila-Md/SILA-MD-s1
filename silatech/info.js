// silatech/info.js
cmd({
    pattern: "info",
    alias: ["botinfo", "about"],
    react: "ℹ️",
    desc: "Show bot information",
    category: "utility",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    
    const defaultConfig = {
        RCD_IMAGE_PATH: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg',
        CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
        GROUP_INVITE_LINK: 'https://chat.whatsapp.com/C0CWyj7RapP2vX7vNdUSTK',
        OWNER_NUMBER: '255612491554',
        PREFIX: '.'
    };
    
    const botNumberFormatted = botNumber || conn.user?.id?.split('@')[0] || 'Unknown';
    const nodeVersion = process.version;
    const version = '2.0.0';
    const commandsCount = global.silaCommands?.size || 0;
    
    const infoMsg = `*╭━━〔 🐢 𝙸𝙽𝙵𝙾 🐢 〕━━┈⊷*
*┃🐢│ • 🤖 𝙱𝙾𝚃: 𝚂𝙸𝙻𝙰 𝙼𝙸𝙽𝙸*
*┃🐢│ • 🔧 𝚅𝙴𝚁𝚂𝙸𝙾𝙽: ${version}*
*┃🐢│ • 📊 𝙲𝙼𝙳𝚂: ${commandsCount}*
*┃🐢│ • 📱 𝙽𝚄𝙼𝙱𝙴𝚁: +${botNumberFormatted}*
*┃🐢│ • 🔧 𝙿𝚁𝙴𝙵𝙸𝚇: ${defaultConfig.PREFIX}*
*┃🐢│ • 🖥️ 𝙽𝙾𝙳𝙴: ${nodeVersion}*
*┃🐢│ • 👑 𝙾𝚆𝙽𝙴𝚁: wa.me/${defaultConfig.OWNER_NUMBER}*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
    
    await conn.sendMessage(from, { 
        image: { url: defaultConfig.RCD_IMAGE_PATH },
        caption: infoMsg,
        contextInfo: conn.forwardContext
    }, { quoted: conn.fkontak });
});
