// silatech/menu.js
cmd({
    pattern: "menu",
    alias: ["help", "commands", "cmds", "all"],
    react: "🤓",
    desc: "Show bot menu",
    category: "general",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    
    const defaultConfig = {
        PREFIX: '.',
        RCD_IMAGE_PATH: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg'
    };
    
    // Get sender name
    let senderName = 'User';
    if (mek.pushName) {
        senderName = mek.pushName;
    }
    
    // Get all commands from silaCommands
    const commandsByCategory = new Map();
    
    if (global.silaCommands) {
        for (const [cmd, cmdData] of global.silaCommands) {
            if (cmdData.pattern && !cmdData.hidden) {
                const category = cmdData.category || 'general';
                if (!commandsByCategory.has(category)) {
                    commandsByCategory.set(category, []);
                }
                if (!commandsByCategory.get(category).includes(cmdData.pattern)) {
                    commandsByCategory.get(category).push(cmdData.pattern);
                }
            }
        }
    }
    
    // Sort categories
    const sortedCategories = Array.from(commandsByCategory.keys()).sort();
    
    // Sort commands in each category
    for (const [category, cmds] of commandsByCategory) {
        cmds.sort();
    }
    
    // Count total commands
    let totalCommands = 0;
    for (const cmds of commandsByCategory.values()) {
        totalCommands += cmds.length;
    }
    
    // Get active sessions count
    let activeSessionsCount = global.activeSockets?.size || 0;
    
    // Build menu message
    let menuText = `*╭━━〔 🐢 𝚂𝙸𝙻𝙰 𝙼𝙴𝙽𝚄 🐢 〕━━┈⊷*
*┃🐢│ 👤 𝚄𝚂𝙴𝚁: ${senderName}*
*┃🐢│ 🔧 𝙿𝚁𝙴𝙵𝙸𝚇: ${defaultConfig.PREFIX}*
*┃🐢│ 📊 𝚃𝙾𝚃𝙰𝙻: ${totalCommands} 𝙲𝙼𝙳𝚂*
*┃🐢│ 👥 𝙰𝙲𝚃𝙸𝚅𝙴: ${activeSessionsCount}*
*╰━━━━━━━━━━━━━━━┈⊷*

`;
    
    // Add each category with commands
    for (const category of sortedCategories) {
        const cmds = commandsByCategory.get(category);
        menuText += `*${category.toUpperCase()}*\n`;
        menuText += `┌─────────────────────┈⊷\n`;
        for (const cmd of cmds) {
            menuText += `┃🐢│ ${defaultConfig.PREFIX}${cmd}\n`;
        }
        menuText += `└─────────────────────┈⊷\n\n`;
    }
    
    menuText += `> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
    
    await conn.sendMessage(from, { 
        image: { url: defaultConfig.RCD_IMAGE_PATH },
        caption: menuText,
        contextInfo: conn.forwardContext
    }, { quoted: conn.fkontak });
});
