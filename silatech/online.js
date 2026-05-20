// silatech/online.js
cmd({
    pattern: "online",
    alias: ["whosonline", "onlinemembers"],
    react: "🟢",
    desc: "check who's online in group",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.participant || mek.key.remoteJid;
    
    await conn.sendMessage(from, { react: { text: "🟢", key: mek.key } });

    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ group command only

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Get group metadata to check if user is admin
    const groupData = await conn.groupMetadata(from).catch(() => null);
    if (!groupData) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Check if user is admin
    const members = groupData.participants;
    const senderParticipant = members.find(p => p.id === sender);
    const isAdmins = senderParticipant && (senderParticipant.admin === "admin" || senderParticipant.admin === "superadmin");
    const isCreator = sender === conn.user.id;

    if (!isCreator && !isAdmins) {
        return await conn.sendMessage(from, {
            text: `❌ admin or owner only command

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        const onlineMembers = new Set();
        
        // Array to hold all presence promises
        const presencePromises = [];
        
        for (const participant of groupData.participants) {
            presencePromises.push(
                conn.presenceSubscribe(participant.id).catch(e => {
                    console.log(`Failed to subscribe to ${participant.id}:`, e.message);
                })
            );
        }

        await Promise.all(presencePromises);

        // Presence update handler
        const presenceHandler = (update) => {
            try {
                if (update.id && update.presences) {
                    const presence = update.presences?.lastKnownPresence;
                    if (['available', 'composing', 'recording'].includes(presence)) {
                        onlineMembers.add(update.id);
                    }
                }
            } catch (e) {
                console.log("Presence handler error:", e.message);
            }
        };

        conn.ev.on('presence.update', presenceHandler);

        // Wait for presence updates
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Remove handler
        conn.ev.off('presence.update', presenceHandler);

        if (onlineMembers.size === 0) {
            return await conn.sendMessage(from, {
                text: `❌ could not detect online members

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }
        
        const onlineArray = Array.from(onlineMembers);
        let message = `*╭━━〔 🐢 𝙾𝙽𝙻𝙸𝙽𝙴 𝙼𝙴𝙼𝙱𝙴𝚁𝚂 🐢 〕━━┈⊷*
*┃🐢│ • 👥 total: ${groupData.participants.length}*
*┃🐢│ • 🟢 online: ${onlineArray.length}*
*╰━━━━━━━━━━━━━━━┈⊷*

`;
        
        // List online members
        for (let i = 0; i < onlineArray.length; i++) {
            message += `*┃🐢│ ${i+1}. @${onlineArray[i].split('@')[0]}*\n`;
        }
        
        message += `*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, { 
            text: message,
            contextInfo: conn.forwardContext,
            mentions: onlineArray
        });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("online command error:", e);
        await conn.sendMessage(from, {
            text: `❌ error checking online members

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});