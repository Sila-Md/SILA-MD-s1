// silatech/addowner.js
const fs = require('fs');
const path = require('path');

// Fake vCard
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© 𝐒𝐈𝐋𝐀-𝐌𝐃",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:𝐒𝐈𝐋𝐀 𝐌𝐃 𝐁𝐎𝐓\nORG:𝐒𝐈𝐋𝐀-𝐌𝐃;\nTEL;type=CELL;type=VOICE;waid=255789661031:+255789661031\nEND:VCARD`
        }
    }
};

// Creator's number
const CREATOR = '255789661031@s.whatsapp.net';

// Path to store owners
const OWNERS_FILE = path.join(__dirname, '../data', 'owners.json');

// Initialize owners file if doesn't exist
const initializeOwnersFile = () => {
    const dir = path.dirname(OWNERS_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(OWNERS_FILE)) {
        fs.writeFileSync(OWNERS_FILE, JSON.stringify([CREATOR], null, 2));
    }
};

// Get all owners
const getOwners = () => {
    try {
        initializeOwnersFile();
        const data = fs.readFileSync(OWNERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [CREATOR];
    }
};

// Add owner
const addOwner = (jid) => {
    try {
        initializeOwnersFile();
        const owners = getOwners();
        if (!owners.includes(jid)) {
            owners.push(jid);
            fs.writeFileSync(OWNERS_FILE, JSON.stringify(owners, null, 2));
        }
        return true;
    } catch (e) {
        return false;
    }
};

// Check if owner
const isOwner = (jid) => {
    const owners = getOwners();
    return owners.includes(jid);
};

// Normalize JID
const normalizeJid = (num) => {
    num = num.replace(/[^0-9]/g, '');
    return num + '@s.whatsapp.net';
};

cmd({
    pattern: "addowner",
    alias: ["silaowner", "setowner"],
    react: "👑",
    desc: "Add bot owner",
    category: "owner",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const sender = mek.key.participant || mek.key.remoteJid;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "👑", key: mek.key } });

    // Check if sender is owner or creator
    if (!isOwner(sender)) {
        return await conn.sendMessage(from, {
            text: `❌ only bot owners can add owners

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Get the number to add
    let targetJid;
    
    if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        // If mentioned
        targetJid = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (q && q.trim()) {
        // If provided as argument
        targetJid = normalizeJid(q.trim());
    } else {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙰𝙳𝙳 𝙾𝚆𝙽𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • 📝 please provide a number or mention*
*┃🐢│ • 📝 example: .addowner 255789661031*
*┃🐢│ • 👑 or mention the user*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Check if already owner
    if (isOwner(targetJid)) {
        return await conn.sendMessage(from, {
            text: `❌ @${targetJid.split('@')[0]} is already an owner

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [targetJid]
        });
    }

    // Add owner
    if (addOwner(targetJid)) {
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙰𝙳𝙳 𝙾𝚆𝙽𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • ✅ new owner added*
*┃🐢│ • 👑 +${targetJid.split('@')[0]}*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [targetJid]
        });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } else {
        await conn.sendMessage(from, {
            text: `❌ failed to add owner

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});