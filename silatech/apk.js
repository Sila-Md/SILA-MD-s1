// silatech/apk.js
const axios = require("axios");

cmd({
    pattern: "apk",
    alias: ["app", "apps", "application", "ap"],
    react: "🥺",
    desc: "Download APK from Aptoide",
    category: "download",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ");

    try {
        if (!q) {
            return await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝙰𝙿𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • 📱 𝚃𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙰𝙽𝚈 𝙰𝙿𝙿*
*┃🐢│ • ✍️ 𝚃𝚈𝙿𝙴: .𝚊𝚙𝚔 <𝚊𝚙𝚙 𝚗𝚊𝚖𝚎>*
*┃🐢│ • 📝 𝙴𝚇𝙰𝙼𝙿𝙻𝙴: .𝚊𝚙𝚔 𝚠𝚑𝚊𝚝𝚜𝚊𝚙𝚙*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`, 
                contextInfo: conn.forwardContext
            }, { quoted: conn.fkontak });
        }

        const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(q)}/limit=1`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data || !data.datalist || !data.datalist.list || !data.datalist.list.length) {
            return await conn.sendMessage(from, { 
                text: `*╭━━〔 🐢 𝙰𝙿𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • ❌ 𝙰𝙿𝙿 " ${q} " 𝙽𝙾𝚃 𝙵𝙾𝚄𝙽𝙳*
*┃🐢│ • 🔍 𝚃𝚁𝚈 𝙳𝙸𝙵𝙵𝙴𝚁𝙴𝙽𝚃 𝙽𝙰𝙼𝙴*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            }, { quoted: conn.fkontak });
        }

        const app = data.datalist.list[0];
        const appSize = (app.size / 1048576).toFixed(2);
        const appName = app.name;
        const appIcon = app.icon || 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg';

        // Send APK
        await conn.sendMessage(from, {
            document: { url: app.file.path_alt },
            fileName: `${appName}.apk`,
            mimetype: "application/vnd.android.package-archive",
            caption: `*╭━━〔 🐢 𝙰𝙿𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • 📱 𝙰𝙿𝙿: ${appName}*
*┃🐢│ • 💾 𝚂𝙸𝚉𝙴: ${appSize} 𝙼𝙱*
*┃🐢│ • ✅ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝙳*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        }, { quoted: conn.fkontak });

    } catch (error) {
        console.error("APK download error:", error);
        await conn.sendMessage(from, { 
            text: `*╭━━〔 🐢 𝙰𝙿𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • ❌ 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙵𝙰𝙸𝙻𝙴𝙳*
*┃🐢│ • 🔄 𝙿𝙻𝙴𝙰𝚂𝙴 𝚃𝚁𝚈 𝙰𝙶𝙰𝙸𝙽*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        }, { quoted: conn.fkontak });
    }
});
