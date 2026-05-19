// silatech/imagine.js
const axios = require("axios");

cmd({
    pattern: "flux",
    alias: ["aiimg", "imagine", "fluxai", "aiimage", "dream"],
    react: "🎨",
    desc: "Generate AI images using multiple providers",
    category: "ai",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const prompt = args.join(" ");

    // React immediately
    await conn.sendMessage(from, { react: { text: "🎨", key: mek.key } });

    if (!prompt) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙸𝙼𝙰𝙶𝙸𝙽𝙴 🐢 〕━━┈⊷*
*┃🐢│ • 🎨 please provide a prompt*
*┃🐢│ • 📝 example: .imagine a beautiful sunset*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        // Try different AI image APIs
        const apis = [
            {
                name: "flux ai",
                url: `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(prompt)}`
            },
            {
                name: "stable diffusion", 
                url: `https://api.siputzx.my.id/api/ai/stable-diffusion?prompt=${encodeURIComponent(prompt)}`
            },
            {
                name: "stability ai",
                url: `https://api.siputzx.my.id/api/ai/stabilityai?prompt=${encodeURIComponent(prompt)}`
            }
        ];

        let imageBuffer = null;
        let apiUsed = "";

        // Try each API until one works
        for (const api of apis) {
            try {
                console.log(`trying ${api.name} api...`);
                const response = await axios.get(api.url, { 
                    responseType: "arraybuffer",
                    timeout: 30000
                });

                if (response.data && response.data.length > 1000) {
                    imageBuffer = Buffer.from(response.data, "binary");
                    apiUsed = api.name;
                    break;
                }
            } catch (apiError) {
                console.log(`${api.name} failed:`, apiError.message);
                continue;
            }
        }

        if (!imageBuffer) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝙸𝙼𝙰𝙶𝙸𝙽𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ❌ image generation failed*
*┃🐢│ • 🔄 all services unavailable*
*┃🐢│ • 💡 please try again later*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }

        // Send the generated image
        await conn.sendMessage(from, {
            image: imageBuffer,
            caption: `*╭━━〔 🐢 𝙸𝙼𝙰𝙶𝙸𝙽𝙴 🐢 〕━━┈⊷*
*┃🐢│ • 🎨 prompt: ${prompt}*
*┃🐢│ • 🤖 model: ${apiUsed}*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });

        // Success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("imagine command error:", error);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙸𝙼𝙰𝙶𝙸𝙽𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ❌ failed to generate image*
*┃🐢│ • 🔄 please try again later*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }
});
