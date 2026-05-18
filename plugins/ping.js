// plugins/ping.js
module.exports = {
    command: 'ping',
    description: 'Check bot response time',
    alias: ['pong', 'latency'],
    category: 'utility',
    async execute(socket, msg, args, botNumber) {
        const from = msg.key.remoteJid;
        
        // Send initial message
        const sentMsg = await socket.sendMessage(from, { 
            text: '*_⚡️ ᴘɪɴɢɪɴɢ ᴛᴏ sᴇʀᴠᴇʀ..._*' 
        }, { quoted: msg });
        
        const startTime = Date.now();
        const endTime = Date.now();
        const ping = endTime - startTime;
        
        const pingMsg = `*╭━━〔 🐢 ᴘɪɴɢ 🐢 〕━━┈⊷*
*┃🐢│ • 🏓 ᴘᴏɴɢ!*
*┃🐢│ • ⚡ ʟᴀᴛᴇɴᴄʏ: ${ping}ms*
*╰━━━━━━━━━━━━━━━┈⊷*

> 🐢 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
        
        await socket.sendMessage(from, { 
            text: pingMsg, 
            edit: sentMsg.key 
        });
    }
};
