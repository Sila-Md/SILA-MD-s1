const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({
    path: './config.env'
});

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    // MongoDB Configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://kxshrii:i7sgjXF6SO2cTJwU@kelumxz.zggub8h.mongodb.net/sila_md_bot',
    
    // Language
    LANG: 'en',
    WELCOME: 'true',
    
    // Auto Settings
    AUTO_VIEW_STATUS: 'true',        // ✅ auto read status
    AUTO_TYPING: 'false',             // ✅ auto typing
    AUTO_RECORDING: 'true',         // ✅ auto recording
    AUTO_REACT_STATUS: 'true',       // ✅ auto reacts
    AUTO_LIKE_STATUS: 'true',        // legacy auto like
    AUTO_LIKE_EMOJI: ['💥','👍','😍','💗','🎈','🎉','🥳','😎','🚀','🔥'],
    
    ALWAYS_ONLINE: 'false',          // ✅ always online mode
    
    PREFIX: '.',                      // command prefix
    OWNER_NAME: 'SILA',             // ✅ owner name
    OWNER_NUMBER: '255612491554',     // ✅ owner number

    HEROKU_APP_URL: 'https://sila-md-mini-bot-hgpz.onrender.com',
    MAX_RETRIES: 3,
    GROUP_INVITE_LINK: 'https://chat.whatsapp.com/C0CWyj7RapP2vX7vNdUSTK',
    ADMIN_LIST_PATH: './lib/admin.json',
    RCD_IMAGE_PATH: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg',  // ✅ IMAGE IMEBADILISHWA
    NEWSLETTER_JID: '120363402325089913@newsletter',  // ✅ JID IMEBADILISHWA
    NEWSLETTER_MESSAGE_ID: '428',
    OTP_EXPIRY: 300000,
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02'  // ✅ CHANNEL IMEBADILISHWA
};
