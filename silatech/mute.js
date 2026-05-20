// silatech/mute.js
cmd({
    pattern: "mute",
    alias: ["silence", "lock"],
    react: "🔇",
    desc: "mute/unmute group",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.participant || mek.key.remoteJid;
    const durationArg = args[0];

    await conn.sendMessage(from, { react: { text: "🔇", key: mek.key } });

    // Check if in group
    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ this command can only be used in groups

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Get group metadata
    const groupData = await conn.groupMetadata(from).catch(() => null);
    if (!groupData) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const members = groupData.participants;
    
    // Check if sender is admin
    const senderParticipant = members.find(p => p.id === sender);
    if (!senderParticipant || (senderParticipant.admin !== "admin" && senderParticipant.admin !== "superadmin")) {
        return await conn.sendMessage(from, {
            text: `❌ only group admins can use this command

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Check if bot is admin
    const botParticipant = members.find(p => p.id === conn.user.id);
    if (!botParticipant || (botParticipant.admin !== "admin" && botParticipant.admin !== "superadmin")) {
        return await conn.sendMessage(from, {
            text: `❌ please make the bot an admin first

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }
    
    // Check if user wants to unmute
    if (durationArg === "off" || durationArg === "unmute" || durationArg === "open") {
        try {
            await conn.groupSettingUpdate(from, 'not_announcement');
            
            const successMsg = `*╭━━〔 🐢 𝚄𝙽𝙼𝚄𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ✅ group unmuted*
*┃🐢│ • 👥 members can now send messages*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
            
            await conn.sendMessage(from, { text: successMsg, contextInfo: conn.forwardContext });
            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
            return;
        } catch (error) {
            console.error('Error unmuting group:', error);
            return await conn.sendMessage(from, {
                text: `❌ failed to unmute group

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }
    }

    // Check for duration
    let durationInMinutes = 0;
    if (durationArg && !isNaN(durationArg)) {
        durationInMinutes = parseInt(durationArg);
        if (durationInMinutes < 1 || durationInMinutes > 1440) {
            return await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝙼𝚄𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ❌ invalid duration*
*┃🐢│ • 📝 use 1-1440 minutes*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }
    }

    try {
        // Mute the group
        await conn.groupSettingUpdate(from, 'announcement');
        
        let successMsg;
        if (durationInMinutes > 0) {
            const durationInMilliseconds = durationInMinutes * 60 * 1000;
            
            successMsg = `*╭━━〔 🐢 𝙼𝚄𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ✅ group muted*
*┃🐢│ • ⏰ duration: ${durationInMinutes} minutes*
*┃🐢│ • 👥 only admins can send messages*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
            
            await conn.sendMessage(from, { text: successMsg, contextInfo: conn.forwardContext });
            
            // Set timeout to unmute after duration
            setTimeout(async () => {
                try {
                    await conn.groupSettingUpdate(from, 'not_announcement');
                    const unmuteMsg = `*╭━━〔 🐢 𝙰𝚄𝚃𝙾 𝚄𝙽𝙼𝚄𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ✅ group automatically unmuted*
*┃🐢│ • ⏰ timer completed: ${durationInMinutes} minutes*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
                    
                    await conn.sendMessage(from, { text: unmuteMsg, contextInfo: conn.forwardContext });
                } catch (unmuteError) {
                    console.error('Error auto-unmuting group:', unmuteError);
                }
            }, durationInMilliseconds);
            
        } else {
            // Permanent mute
            successMsg = `*╭━━〔 🐢 𝙿𝙴𝚁𝙼𝙰𝙽𝙴𝙽𝚃 𝙼𝚄𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ✅ group permanently muted*
*┃🐢│ • 👥 only admins can send messages*
*┃🐢│ • 💡 use: .mute off to unmute*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
            
            await conn.sendMessage(from, { text: successMsg, contextInfo: conn.forwardContext });
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error('Error in mute command:', error);
        await conn.sendMessage(from, {
            text: `❌ failed to mute/unmute group

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});
