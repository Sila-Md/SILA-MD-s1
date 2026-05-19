// plugins/menu.js
module.exports = {
    command: 'menu',
    alias: ['help', 'commands', 'cmds', 'all'],
    react: '📋',
    desc: 'Show bot menu',
    category: 'utility',
    async execute(socket, msg, args, botNumber) {
        const from = msg.key.remoteJid;
        
        const defaultConfig = {
            PREFIX: '.',
            RCD_IMAGE_PATH: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg'
        };
        
        // Get sender name (mtu aliepiga command)
        let senderName = 'User';
        if (msg.pushName) {
            senderName = msg.pushName;
        } else if (msg.key?.participant) {
            senderName = msg.key.participant.split('@')[0];
        } else if (msg.key?.remoteJid) {
            senderName = msg.key.remoteJid.split('@')[0];
        }
        
        // Get all available commands from plugins with categories
        const commandsByCategory = new Map();
        
        for (const [cmd, plugin] of global.plugins || socket.plugins || new Map()) {
            if (plugin.command && !plugin.hidden) {
                const category = plugin.category || 'general';
                if (!commandsByCategory.has(category)) {
                    commandsByCategory.set(category, []);
                }
                commandsByCategory.get(category).push(cmd);
            }
        }
        
        // Sort categories alphabetically
        const sortedCategories = Array.from(commandsByCategory.keys()).sort();
        
        // Sort commands in each category
        for (const [category, cmds] of commandsByCategory) {
            cmds.sort();
        }
        
        // Get active sessions count
        let activeSessionsCount = 0;
        if (global.activeSockets) {
            activeSessionsCount = global.activeSockets.size;
        } else if (socket.activeSockets) {
            activeSessionsCount = socket.activeSockets.size;
        }
        
        // Count total commands
        let totalCommands = 0;
        for (const cmds of commandsByCategory.values()) {
            totalCommands += cmds.length;
        }
        
        // Build menu message
        let menuText = `*╭━━〔 🐢 𝚂𝙸𝙻𝙰 𝙼𝙴𝙽𝚄 🐢 〕━━┈⊷*
*┃🐢│ 👤 𝚄𝚂𝙴𝚁: ${senderName}*
*┃🐢│ 🔧 𝙿𝚁𝙴𝙵𝙸𝚇: ${defaultConfig.PREFIX}*
*┃🐢│ 📊 𝚃𝙾𝚃𝙰𝙻: ${totalCommands} 𝙲𝙼𝙳𝚂*
*┃🐢│ 👥 𝙰𝙲𝚃𝙸𝚅𝙴: ${activeSessionsCount}*
*╰━━━━━━━━━━━━━━━┈⊷*

`;
        
        // Add each category with commands (each command has 🐢 like ping)
        for (const category of sortedCategories) {
            const cmds = commandsByCategory.get(category);
            // Category name in bold dark text (no emoji)
            menuText += `*${category.toUpperCase()}*\n`;
            menuText += `┌─────────────────────┈⊷\n`;
            for (const cmd of cmds) {
                menuText += `┃🐢│ ${defaultConfig.PREFIX}${cmd}\n`;
            }
            menuText += `└─────────────────────┈⊷\n\n`;
        }
        
        menuText += `> 🐢 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝙱𝚢 𝚂𝚒𝚕𝚊`;
        
        // Send with fake vCard and context info
        await socket.sendMessage(from, { react: { text: this.react, key: msg.key } });
        await socket.sendMessage(from, { 
            image: { url: defaultConfig.RCD_IMAGE_PATH },
            caption: menuText,
            contextInfo: socket.forwardContext
        }, { quoted: socket.fkontak });
    }
};
