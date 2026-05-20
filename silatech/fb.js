// silatech/fb2.js
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

cmd({
    pattern: "fb2",
    alias: ["facebook2", "fbdl2", "fb", "facebook"],
    react: "📥",
    desc: "Download Facebook video",
    category: "media",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const text = args.join(" ");
    
    // React
    await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });
    
    if (!text || text.trim().length < 2) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • 📝 usage: .fb facebook_url*
*┃🐢│ • 📝 example: .fb https://fb.watch/xxx*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Extract URL from command
    let url = text;
    
    // Remove command prefix if present
    const cmdPrefixes = [".fb", ".fb2", ".facebook", ".facebook2", ".fbdl2"];
    for (const prefix of cmdPrefixes) {
        if (url.toLowerCase().startsWith(prefix.toLowerCase())) {
            url = url.slice(prefix.length).trim();
            break;
        }
    }
    
    if (!url) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • ❌ please provide a facebook link*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Validate Facebook URL
    const facebookPatterns = [
        /https?:\/\/(?:www\.|m\.)?facebook\.com\//,
        /https?:\/\/(?:www\.)?fb\.watch\//,
        /https?:\/\/(?:www\.)?facebook\.com\/watch\//,
        /https?:\/\/(?:www\.)?fb\.com\//
    ];

    const isValidUrl = facebookPatterns.some(pattern => pattern.test(url));
    
    if (!isValidUrl) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • ❌ that is not a valid facebook link*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        // Resolve share/short URLs to their final destination first
        let resolvedUrl = url;
        try {
            const res = await axios.get(url, { 
                timeout: 20000, 
                maxRedirects: 10, 
                headers: { 'User-Agent': 'Mozilla/5.0' } 
            });
            if (res?.request?.res?.responseUrl) {
                resolvedUrl = res.request.res.responseUrl;
            }
        } catch (e) {
            console.log("URL resolution failed:", e.message);
        }

        // Helper to call API with retries and variants
        async function fetchFromApi(u) {
            const apiUrl = `https://api.princetechn.com/api/download/facebook?apikey=prince&url=${encodeURIComponent(u)}`;
            return axios.get(apiUrl, {
                timeout: 40000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*'
                },
                maxRedirects: 5,
                validateStatus: s => s >= 200 && s < 500
            });
        }

        // Try resolved URL, then fallback to original URL
        let response;
        try {
            response = await fetchFromApi(resolvedUrl);
            if (!response || response.status >= 400 || !response.data) throw new Error('bad');
        } catch (e) {
            console.log("First API call failed, trying original URL");
            try {
                response = await fetchFromApi(url);
            } catch (err) {
                console.log("Second API call failed:", err.message);
                throw err;
            }
        }

        const data = response.data;

        if (!data || data.status !== 200 || !data.success || !data.result) {
            return await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • ❌ api did not return valid data*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }

        const fbvid = data.result.hd_video || data.result.sd_video;

        if (!fbvid) {
            return await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • ❌ wrong facebook data. please ensure the video exists*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }

        // Create temp directory if it doesn't exist
        const tmpDir = path.join(__dirname, '../temp');
        await fs.ensureDir(tmpDir);

        // Generate temp file path
        const tempFile = path.join(tmpDir, `fb_${Date.now()}.mp4`);

        try {
            // Download the video
            const videoResponse = await axios({
                method: 'GET',
                url: fbvid,
                responseType: 'stream',
                timeout: 60000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Range': 'bytes=0-',
                    'Connection': 'keep-alive',
                    'Referer': 'https://www.facebook.com/'
                }
            });

            const writer = fs.createWriteStream(tempFile);
            videoResponse.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            // Check if file was downloaded successfully
            if (!(await fs.pathExists(tempFile)) || (await fs.stat(tempFile)).size === 0) {
                throw new Error('Failed to download video');
            }

            // Send the video
            const caption = `*╭━━〔 🐢 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 🐢 〕━━┈⊷*
*┃🐢│ • 📥 downloaded successfully*
*┃🐢│ • 📹 quality: ${data.result.hd_video ? "𝙷𝙳" : "𝚂𝙳"}*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

            await conn.sendMessage(from, {
                video: { url: tempFile },
                mimetype: "video/mp4",
                caption: caption,
                contextInfo: conn.forwardContext
            });

            // Clean up temp file after sending
            setTimeout(async () => {
                try {
                    await fs.unlink(tempFile);
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError.message);
                }
            }, 5000);

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

        } catch (downloadError) {
            console.error('Video download error:', downloadError);
            
            // Try sending via URL directly
            try {
                const caption = `*╭━━〔 🐢 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 🐢 〕━━┈⊷*
*┃🐢│ • 📥 downloaded successfully*
*┃🐢│ • 📹 quality: ${data.result.hd_video ? "𝙷𝙳" : "𝚂𝙳"}*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

                await conn.sendMessage(from, {
                    video: { url: fbvid },
                    mimetype: "video/mp4",
                    caption: caption,
                    contextInfo: conn.forwardContext
                });
                
                await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
                
            } catch (urlError) {
                console.error('URL send error:', urlError);
                await conn.sendMessage(from, {
                    text: `*╭━━〔 🐢 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • ❌ failed to download facebook video*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                    contextInfo: conn.forwardContext
                });
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            }
        }

    } catch (error) {
        console.error('Error in Facebook command:', error);
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • ❌ error downloading facebook video*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});
