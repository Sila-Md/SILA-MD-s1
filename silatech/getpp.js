// silatech/getpp.js
cmd({
    pattern: "getpp",
    alias: ["pp", "profilepic", "dp"],
    react: "📸",
    desc: "Fetch profile picture of a WhatsApp user by phone number",
    category: "tools",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;

    try {
        if (!args[0]) {
            return await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝙶𝙴𝚃 𝙿𝙿 🐢 〕━━┈⊷*
*┃🐢│ • 📸 please provide a phone number*
*┃🐢│ • 📝 example: .getpp 255612491554*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }

        // Clean the phone number and create JID
        const cleanNumber = args[0].replace(/[^0-9]/g, "");
        const targetJid = cleanNumber + "@s.whatsapp.net";

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(targetJid, "image");
        } catch (e) {
            return await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝙶𝙴𝚃 𝙿𝙿 🐢 〕━━┈⊷*
*┃🐢│ • 🖼️ no profile picture found*
*┃🐢│ • ❌ or it cannot be accessed*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }

        // Get user name
        let userName = cleanNumber;
        try {
            const contact = await conn.getContact(targetJid);
            userName = contact.notify || contact.vname || contact.name || cleanNumber;
        } catch (e) {
            console.log("Could not fetch contact info:", e.message);
        }

        // Send the profile picture with caption
        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: `*╭━━〔 🐢 𝙶𝙴𝚃 𝙿𝙿 🐢 〕━━┈⊷*
*┃🐢│ • 📸 profile picture of +${cleanNumber}*
*┃🐢│ • 👤 name: ${userName}*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });

        // React with success emoji
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error('Error in getpp plugin:', e);
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙶𝙴𝚃 𝙿𝙿 🐢 〕━━┈⊷*
*┃🐢│ • ❌ an error occurred*
*┃🐢│ • 🔄 please try again later*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});
