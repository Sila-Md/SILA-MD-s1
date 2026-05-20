// silatech/img.js
const axios = require('axios');

// Unsplash API Key
const UNSPLASH_API_KEY = "TKwNF_gHeB4Z6ieR6sV_Q8gIkQW_VFOcmiNfD0AX0uM";

cmd({
    pattern: "img",
    alias: ["image", "searchimg", "pic", "photo"],
    react: "🖼️",
    desc: "Search and download images from Unsplash",
    category: "search",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "🖼️", key: mek.key } });

    if (!q) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 🐢 〕━━┈⊷*
*┃🐢│ • 🖼️ search images from unsplash*
*┃🐢│ • 📝 usage: .img <keywords> [number]*
*┃🐢│ • 📝 examples:*
*┃🐢│    • .img beautiful sunset*
*┃🐢│    • .img cute cats 5*
*┃🐢│    • .img nature 10*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Parse arguments
    const argsList = q.split(' ');
    let imageCount = 3; // Default
    
    // Check if last argument is a number
    const lastArg = argsList[argsList.length - 1];
    const parsedCount = parseInt(lastArg);
    
    let searchQuery;
    if (!isNaN(parsedCount) && parsedCount > 0 && parsedCount <= 20) {
        imageCount = parsedCount;
        searchQuery = argsList.slice(0, -1).join(' ');
    } else {
        searchQuery = q;
    }
    
    // Limit max images
    if (imageCount > 10) imageCount = 10;
    
    if (!searchQuery || searchQuery.trim() === '') {
        return await conn.sendMessage(from, {
            text: `❌ please provide search keywords

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        // Make API request
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=${imageCount}&client_id=${UNSPLASH_API_KEY}`;
        const { data } = await axios.get(url);
        
        if (!data.results || data.results.length === 0) {
            return await conn.sendMessage(from, {
                text: `❌ no images found for "${searchQuery}"

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }
        
        // Send images
        let sentCount = 0;
        const imagesToSend = data.results.slice(0, imageCount);
        
        for (const [index, image] of imagesToSend.entries()) {
            try {
                await conn.sendMessage(from, {
                    image: { url: image.urls.regular },
                    caption: `*╭━━〔 🐢 𝙸𝙼𝙰𝙶𝙴 𝚁𝙴𝚂𝚄𝙻𝚃 🐢 〕━━┈⊷*
*┃🐢│ • 🖼️ search: ${searchQuery}*
*┃🐢│ • 📸 photographer: ${image.user.name || 'unknown'}*
*┃🐢│ • 👍 likes: ${image.likes || 0}*
*┃🐢│ • 🖼️ image ${index + 1} of ${imagesToSend.length}*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                    contextInfo: conn.forwardContext
                });
                
                sentCount++;
                
                // Add delay between sending images
                if (index < imagesToSend.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
                
            } catch (imageError) {
                console.error(`Error sending image ${index + 1}:`, imageError);
            }
        }
        
        // Send completion message
        if (sentCount > 0) {
            await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝚂𝙴𝙰𝚁𝙲𝙷 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ✅ successfully sent ${sentCount} images*
*┃🐢│ • 🔍 search query: ${searchQuery}*
*┃🐢│ • 🖼️ source: unsplash api*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        } else {
            await conn.sendMessage(from, {
                text: `❌ failed to send any images

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        }
        
    } catch (apiError) {
        console.error('API Error:', apiError);
        
        let errorMsg = `❌ error fetching images`;
        
        if (apiError.response?.status === 401) {
            errorMsg = `❌ api key invalid or expired`;
        } else if (apiError.response?.status === 429) {
            errorMsg = `❌ rate limit exceeded. try again later`;
        } else {
            errorMsg = `❌ error fetching images: ${apiError.message}`;
        }
        
        await conn.sendMessage(from, {
            text: `${errorMsg}

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});