// plugins/info.js
module.exports = {
    command: 'info',
    alias: ['botinfo', 'about'],
    react: 'ℹ️',
    desc: 'Show bot information',
    category: 'utility',
    async execute(socket, msg, args, botNumber) {
        const from = msg.key.remoteJid;
        
        const defaultConfig = {
            RCD_IMAGE_PATH: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg',
            CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
            GROUP_INVITE_LINK: 'https://chat.whatsapp.com/C0CWyj7RapP2vX7vNdUSTK',
            OWNER_NUMBER: '255612491554',
            PREFIX: '.'
        };
        
        const botNumberFormatted = botNumber || socket.user?.id?.split('@')[0] || 'Unknown';
        const nodeVersion = process.version;
        const version = '2.0.0';
        
        const infoMsg = `*╭━━〔 🐢 𝙸𝙽𝙵𝙾 🐢 〕━━┈⊷*
*┃🐢│ • 🤖 𝙱𝙾𝚃: 𝚂𝙸𝙻𝙰 𝙼𝙸𝙽𝙸*
*┃🐢│ • 🔧 𝚅𝙴𝚁𝚂𝙸𝙾𝙽: ${version}*
*┃🐢│ • 📱 𝙽𝚄𝙼𝙱𝙴𝚁: +${botNumberFormatted}*
*┃🐢│ • 🔧 𝙿𝚁𝙴𝙵𝙸𝚇: ${defaultConfig.PREFIX}*
*┃🐢│ • 🖥️ 𝙽𝙾𝙳𝙴: ${nodeVersion}*
*┃🐢│ • 👑 𝙾𝚆𝙽𝙴𝚁: wa.me/${defaultConfig.OWNER_NUMBER}*
*┃🐢│ • 📢 𝙲𝙷𝙰𝙽𝙽𝙴𝙻: ${defaultConfig.CHANNEL_LINK}*
*┃🐢│ • 👥 𝙶𝚁𝙾𝚄𝙿: ${defaultConfig.GROUP_INVITE_LINK}*
*╰━━━━━━━━━━━━━━━┈⊷*

> 🐢 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝙱𝚢 𝚂𝚒𝚕𝚊`;

        await socket.sendMessage(from, { react: { text: this.react, key: msg.key } });
        await socket.sendMessage(from, { 
            image: { url: defaultConfig.RCD_IMAGE_PATH },
            caption: infoMsg,
            contextInfo: socket.forwardContext
        }, { quoted: msg });
    }
};
