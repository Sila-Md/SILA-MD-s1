// silatech/promote.js
cmd({
    pattern: "promote",
    alias: ["p", "makeadmin", "admin"],
    react: "👑",
    desc: "Promote a member to group admin",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.participant || mek.key.remoteJid;

    await conn.sendMessage(from, { react: { text: "👑", key: mek.key } });

    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ this command can only be used in groups

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Get group metadata
    const metadata = await conn.groupMetadata(from).catch(() => null);
    if (!metadata) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const participants = metadata.participants;
    const groupAdmins = participants.filter(p => p.admin).map(a => a.id);
    const isAdmin = groupAdmins.includes(sender);

    // Check if user is admin
    if (!isAdmin) {
        return await conn.sendMessage(from, {
            text: `❌ only group admins can use this

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    let userToPromote = [];
    
    // Check for mentioned users
    if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        userToPromote = mek.message.extendedTextMessage.contextInfo.mentionedJid;
    }
    // Check for replied message
    else if (mek.message?.extendedTextMessage?.contextInfo?.participant) {
        userToPromote = [mek.message.extendedTextMessage.contextInfo.participant];
    }
    
    // If no user found through either method
    if (userToPromote.length === 0) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 PROMOTE 🐢 〕━━┈⊷*
*┃🐢│ • 📝 please mention the user or reply*
*┃🐢│ • 💬 to their message to promote*
*┃🐢│ • 📝 example: .promote @user*
*╰━━━━━━━━━━━━━━━┈⊷*
𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        // Filter users who are already admins
        const alreadyAdmins = userToPromote.filter(jid => groupAdmins.includes(jid));
        const validUsers = userToPromote.filter(jid => !groupAdmins.includes(jid));
        
        // Check if users exist in group
        const nonExistingUsers = validUsers.filter(jid => !participants.some(p => p.id === jid));
        const finalUsers = validUsers.filter(jid => participants.some(p => p.id === jid));

        if (finalUsers.length === 0) {
            let errorMsg = `❌ no valid users to promote\n\n`;
            if (alreadyAdmins.length > 0) {
                errorMsg += `⚠️ already admin: ${alreadyAdmins.map(j => `@${j.split('@')[0]}`).join(', ')}\n`;
            }
            if (nonExistingUsers.length > 0) {
                errorMsg += `❌ not in group: ${nonExistingUsers.map(j => `@${j.split('@')[0]}`).join(', ')}`;
            }
            return await conn.sendMessage(from, {
                text: `${errorMsg}

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext,
                mentions: [...alreadyAdmins, ...nonExistingUsers]
            });
        }

        // Promote users
        await conn.groupParticipantsUpdate(from, finalUsers, "promote");
        
        // Get usernames for each promoted user
        const usernames = finalUsers.map(jid => `@${jid.split('@')[0]}`);
        
        const promotionMessage = `*╭━━〔 🐢 GROUP PROMOTION 🐢 〕━━┈⊷*
*┃🐢│ • 👥 promoted user${finalUsers.length > 1 ? 's' : ''}: ${usernames.join(', ')}*
*┃🐢│ • 👑 promoted by: @${sender.split('@')[0]}*
*┃🐢│ • 📅 date: ${new Date().toLocaleString()}*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            text: promotionMessage,
            contextInfo: conn.forwardContext,
            mentions: [...finalUsers, sender]
        });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("Promote Error:", error);
        
        let errorText = `❌ failed to promote user(s)\n`;
        
        if (error.message?.includes("not-authorized") || error.message?.includes("admin")) {
            errorText = `❌ bot needs to be admin in this group
make me admin first then try again`;
        } else {
            errorText = `❌ failed to promote user(s)\nplease try again later`;
        }
        
        await conn.sendMessage(from, {
            text: `${errorText}

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});
