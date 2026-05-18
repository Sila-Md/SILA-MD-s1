// plugins/alive.js
module.exports = {
    command: 'alive',
    description: 'Check if bot is active',
    alias: ['status', 'runtime'],
    category: 'utility',
    async execute(socket, msg, args, botNumber) {
        const from = msg.key.remoteJid;
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const defaultConfig = {
            PREFIX: '.',
            RCD_IMAGE_PATH: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg'
        };
        
        const aliveMsg = `*╭━━〔 🐢 ᴀʟɪᴠᴇ 🐢 〕━━┈⊷*
*┃🐢│ • ʙᴏᴛ: ꜱɪʟᴀ ᴍɪɴɪ*
*┃🐢│ • ꜱᴛᴀᴛᴜꜱ: ✅ ᴀᴄᴛɪᴠᴇ*
*┃🐢│ • ᴘʀᴇꜰɪx: ${defaultConfig.PREFIX}*
*┃🐢│ • ʀᴜɴᴛɪᴍᴇ: ${hours}h ${minutes}m ${seconds}s*
*╰━━━━━━━━━━━━━━━┈⊷*
> 🐢 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await socket.sendMessage(from, { 
            image: { url: defaultConfig.RCD_IMAGE_PATH },
            caption: aliveMsg
        }, { quoted: msg });
    }
};
