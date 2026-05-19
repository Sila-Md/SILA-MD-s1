// silatech/tts.js
const googleTTS = require("google-tts-api");
const axios = require("axios");

cmd({
    pattern: "tts",
    alias: ["say", "speak", "voice"],
    react: "🎤",
    desc: "Convert text into voice (Text-To-Speech)",
    category: "fun",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const q = args.join(" ");

    // 🎤 react on command
    await conn.sendMessage(from, { react: { text: "🎤", key: mek.key } });

    if (!q) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝚃𝚃𝚂 🐢 〕━━┈⊷*
*┃🐢│ • 🎤 please provide text to speak*
*┃🐢│ • 📝 example: .tts hello world*
*┃🐢│ • 🌐 for urdu: .tts ur السلام عليكم*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        // 🗣 Language detection
        let voiceLang = "en";
        let textToSpeak = q;
        
        if (args[0].toLowerCase() === "ur" || args[0].toLowerCase() === "urdu") {
            voiceLang = "ur";
            textToSpeak = args.slice(1).join(" ");
            if (!textToSpeak) {
                return await conn.sendMessage(from, {
                    text: `*╭━━〔 🐢 𝚃𝚃𝚂 🐢 〕━━┈⊷*
*┃🐢│ • 📝 example: .tts ur السلام عليكم*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                    contextInfo: conn.forwardContext
                });
            }
        }

        // 🎧 Get TTS URL
        const ttsUrl = googleTTS.getAudioUrl(textToSpeak, {
            lang: voiceLang,
            slow: false,
            host: "https://translate.google.com",
        });

        // 📥 Download audio
        const { data } = await axios.get(ttsUrl, { responseType: "arraybuffer" });
        const audioBuffer = Buffer.from(data, "binary");

        // 🎤 Send audio message
        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: "audio/mp4",
            ptt: false,
        });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error("TTS Error:", err);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        // Error without box style - plain text only
        await conn.sendMessage(from, {
            text: `❌ voice generation failed: ${err.message}`
        });
    }
});
