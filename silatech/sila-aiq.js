// silatech/copilot.js
const axios = require('axios');

const AXIOS_DEFAULTS = {
    timeout: 30000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
    }
};

async function getCopilotResponse(query) {
    const apiUrl = `https://api.yupra.my.id/api/ai/copilot?text=${encodeURIComponent(query)}`;
    const res = await axios.get(apiUrl, AXIOS_DEFAULTS);
    if (res?.data?.status && res?.data?.result?.response) {
        return res.data.result.response;
    }
    throw new Error('No response from AI');
}

// ==================== COMMAND: COPILOT ====================
cmd({
    pattern: 'copilot',
    alias: ['ai2', 'silaai', 'ask', 'query', 'gpt', 'silacop'],
    react: '🤖',
    desc: 'Ask AI Copilot anything',
    category: 'ai',
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "🤖", key: mek.key } });

    if (!q) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙲𝙾𝙿𝙸𝙻𝙾𝚃 𝙰𝙸 🐢 〕━━┈⊷*
*┃🐢│ • 🤖 ask me anything*
*┃🐢│ • 📝 usage: .copilot your question*
*┃🐢│ • 📝 example: .copilot what is economics*
*┃🐢│ • 🔧 aliases: .ai, .ask, .gpt, .silaai*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        let response = await getCopilotResponse(q);

        if (!response) {
            return await conn.sendMessage(from, {
                text: `❌ no response received from ai

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }

        // Format response
        let formattedResponse = response;
        if (response.length > 4000) {
            formattedResponse = response.substring(0, 3997) + '...';
        }

        const finalMsg = `*╭━━〔 🐢 𝙲𝙾𝙿𝙸𝙻𝙾𝚃 𝙰𝙸 🐢 〕━━┈⊷*
*┃🐢│ • 🤖 here's my answer:*
*┃🐢│*
${formattedResponse.split('\n').map(line => `*┃🐢│ ${line}*`).join('\n')}
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            text: finalMsg,
            contextInfo: conn.forwardContext
        });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error('Copilot error:', err);
        await conn.sendMessage(from, {
            text: `❌ api error. please try again later.

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== COMMAND: AIX (Advanced Explain) ====================
cmd({
    pattern: 'aix',
    alias: ['copilotx', 'aiexplain', 'explain'],
    react: '🧠',
    desc: 'Advanced AI explanation',
    category: 'ai',
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "🧠", key: mek.key } });

    if (!q) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙰𝙸 𝙴𝚇𝙿𝙻𝙰𝙸𝙽 🐢 〕━━┈⊷*
*┃🐢│ • 🧠 explain anything in detail*
*┃🐢│ • 📝 usage: .aix your question*
*┃🐢│ • 📝 example: .aix how to learn programming*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        const prompt = `Explain this in detail: ${q}`;
        let response = await getCopilotResponse(prompt);

        if (!response) {
            return await conn.sendMessage(from, {
                text: `❌ no response received from ai

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }

        let formattedResponse = response;
        if (response.length > 4000) {
            formattedResponse = response.substring(0, 3997) + '...';
        }

        const explainMsg = `*╭━━〔 🐢 𝙳𝙴𝚃𝙰𝙸𝙻𝙴𝙳 𝙴𝚇𝙿𝙻𝙰𝙽𝙰𝚃𝙸𝙾𝙽 🐢 〕━━┈⊷*
${formattedResponse.split('\n').map(line => `*┃🐢│ ${line}*`).join('\n')}
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            text: explainMsg,
            contextInfo: conn.forwardContext
        });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error('AIX error:', err);
        await conn.sendMessage(from, {
            text: `❌ api error. please try again later.

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});