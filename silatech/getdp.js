// silatech/getdp.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const ppDir = path.join(__dirname, '../ppdata');
if (!fs.existsSync(ppDir)) fs.mkdirSync(ppDir, { recursive: true });

cmd({
    pattern: "getdp",
    alias: ["getpp", "setpp", "savepp"],
    react: "📸",
    desc: "Save image URLs and auto update profile picture every 5 minutes",
    category: "tools",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const sender = mek.key.participant || mek.key.remoteJid;
    const number = sender.split('@')[0];

    try {
        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝙶𝙴𝚃 𝙳𝙿 🐢 〕━━┈⊷*
*┃🐢│ • 📸 please provide image urls*
*┃🐢│ • ✍️ separated by commas*
*┃🐢│ • 📝 example: .getdp https://file.com/1.jpg*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }

        const urls = args.join(' ').split(',').map(x => x.trim()).filter(Boolean);
        if (urls.length === 0) {
            return await conn.sendMessage(from, {
                text: `❌ no valid image urls found.`
            });
        }

        const filePath = path.join(ppDir, `${number}.json`);
        fs.writeFileSync(filePath, JSON.stringify({ urls, index: 0 }));

        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙶𝙴𝚃 𝙳𝙿 🐢 〕━━┈⊷*
*┃🐢│ • ✅ saved ${urls.length} profile pictures*
*┃🐢│ • 🔄 auto changer will update*
*┃🐢│ • 📱 your profile pic every 5 minutes*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });

    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, {
            text: `❌ error saving urls. please check input and try again.`
        });
    }
});
