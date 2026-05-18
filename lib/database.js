const mongoose = require('mongoose');
const config = require('../config');

// MongoDB Connection URI - from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sila_md_bot';

// ==================== SCHEMAS ====================

// Settings Schema
const settingsSchema = new mongoose.Schema({
    LANG: { type: String, default: 'EN' },
    ANTI_BAD: { type: Array, default: [] },
    MAX_SIZE: { type: Number, default: 100 },
    ONLY_GROUP: { type: Boolean, default: false },
    ANTI_LINK: { type: Array, default: [] },
    ANTI_BOT: { type: Array, default: [] },
    ALIVE: { type: String, default: 'default' },
    FOOTER: { type: String, default: '𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳' },
    LOGO: { type: String, default: 'https://files.catbox.moe/90i7j4.png' }
}, { timestamps: true });

// Button Store Schema
const buttonStoreSchema = new mongoose.Schema({
    MsgID: { type: String, required: true, unique: true },
    CmdID: { type: String, required: true }
}, { timestamps: true });

// Sessions Schema (for WhatsApp auth)
const sessionSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    creds: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// User Config Schema
const userConfigSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    WELCOME: { type: String, default: 'true' },
    AUTO_VIEW_STATUS: { type: String, default: 'true' },
    AUTO_VOICE: { type: String, default: 'true' },
    AUTO_LIKE_STATUS: { type: String, default: 'true' },
    AUTO_RECORDING: { type: String, default: 'true' },
    AUTO_TYPING: { type: String, default: 'true' },
    AUTO_REPLY: { type: String, default: 'true' },
    AUTO_STATUS_REPLY: { type: String, default: 'true' },
    READ_MESSAGE: { type: String, default: 'true' },
    ANTI_CALL: { type: String, default: 'true' },
    ANTI_DELETE: { type: String, default: 'true' },
    ANTI_LINK: { type: String, default: 'false' },
    AUTO_BIO: { type: String, default: 'true' },
    AUTO_LIKE_EMOJI: { type: Array, default: ['💥', '👍', '😍', '💗', '🎈', '🎉', '🥳', '😎', '🚀', '🔥'] },
    PREFIX: { type: String, default: '.' },
    MAX_RETRIES: { type: Number, default: 3 },
    GROUP_INVITE_LINK: { type: String, default: 'https://chat.whatsapp.com/IdGNaKt80DEBqirc2ek4ks' },
    RCD_IMAGE_PATH: { type: String, default: './lod-x-free.jpg' },
    NEWSLETTER_JID: { type: String, default: '120363422610520277@newsletter' },
    NEWSLETTER_MESSAGE_ID: { type: String, default: '428' },
    OTP_EXPIRY: { type: Number, default: 300000 },
    OWNER_NUMBER: { type: String, default: '255612491554' },
    CHANNEL_LINK: { type: String, default: 'https://whatsapp.com/channel/0029VbBPxQTJUM2WCZLB6j28' },
    REJECT_MSG: { type: String, default: 'Please don\'t call me! 😊' },
    BIO_LIST: { type: Array, default: [
        "🐢 SILA-MD-MINI | 🤖 AI Assistant",
        "🌟 Powered by SILA TECH | 🚀 Fast & Reliable",
        "💫 SILA-MD-MINI Bot | Always Active!"
    ]}
}, { timestamps: true });

// Numbers List Schema
const numbersListSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    connectedAt: { type: Date, default: Date.now }
});

// OTP Store Schema
const otpStoreSchema = new mongoose.Schema({
    number: { type: String, required: true },
    otp: { type: String, required: true },
    config: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // Auto expire after 5 minutes
});

// Stats Schema
const statsSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    commandsUsed: { type: Number, default: 0 },
    messagesReceived: { type: Number, default: 0 },
    groupsInteracted: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

// Auto Replies Schema
const autoRepliesSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    replies: { type: Map, of: String, default: {} }
}, { timestamps: true });

// Welcome Messages Schema
const welcomeMessagesSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    welcome: { type: String, default: '' },
    leave: { type: String, default: '' }
}, { timestamps: true });

// ==================== MODELS ====================

let Settings, ButtonStore, Session, UserConfig, NumbersList, OTPStore, Stats, AutoReplies, WelcomeMessages;

// ==================== CONNECTION FUNCTION ====================

const connectdb = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        // Initialize models after connection
        Settings = mongoose.model('Setting', settingsSchema);
        ButtonStore = mongoose.model('ButtonStore', buttonStoreSchema);
        Session = mongoose.model('Session', sessionSchema);
        UserConfig = mongoose.model('UserConfig', userConfigSchema);
        NumbersList = mongoose.model('NumbersList', numbersListSchema);
        OTPStore = mongoose.model('OTPStore', otpStoreSchema);
        Stats = mongoose.model('Stat', statsSchema);
        AutoReplies = mongoose.model('AutoReply', autoRepliesSchema);
        WelcomeMessages = mongoose.model('WelcomeMessage', welcomeMessagesSchema);
        
        // Check if settings exist, if not create default
        const settingsExist = await Settings.findOne();
        if (!settingsExist) {
            await Settings.create({
                LANG: 'EN',
                ANTI_BAD: [],
                MAX_SIZE: 100,
                ONLY_GROUP: false,
                ANTI_LINK: [],
                ANTI_BOT: [],
                ALIVE: 'default',
                FOOTER: '𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳',
                LOGO: 'https://files.catbox.moe/90i7j4.png'
            });
            console.log('✅ Default settings created in MongoDB');
        }
        
        console.log('✅ MongoDB Connected Successfully!');
        
        // Update global config
        await updb();
        
        return true;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        return false;
    }
};

// ==================== SETTINGS FUNCTIONS ====================

async function input(setting, data) {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        
        switch(setting) {
            case "LANG":
                settings.LANG = data;
                config.LANG = data;
                break;
            case "ANTI_BAD":
                settings.ANTI_BAD = data;
                config.ANTI_BAD = data;
                break;
            case "MAX_SIZE":
                settings.MAX_SIZE = data;
                config.MAX_SIZE = data;
                break;
            case "ONLY_GROUP":
                settings.ONLY_GROUP = data;
                config.ONLY_GROUP = data;
                break;
            case "ANTI_LINK":
                settings.ANTI_LINK = data;
                config.ANTI_LINK = data;
                break;
            case "ANTI_BOT":
                settings.ANTI_BOT = data;
                config.ANTI_BOT = data;
                break;
            case "ALIVE":
                settings.ALIVE = data;
                config.ALIVE = data;
                break;
            case "FOOTER":
                settings.FOOTER = data;
                config.FOOTER = data;
                break;
            case "LOGO":
                settings.LOGO = data;
                config.LOGO = data;
                break;
            default:
                return false;
        }
        
        await settings.save();
        return true;
    } catch (error) {
        console.error('input error:', error);
        return false;
    }
}

async function get(setting) {
    try {
        const settings = await Settings.findOne();
        if (!settings) return null;
        
        switch(setting) {
            case "LANG": return settings.LANG;
            case "ANTI_BAD": return settings.ANTI_BAD;
            case "MAX_SIZE": return settings.MAX_SIZE;
            case "ONLY_GROUP": return settings.ONLY_GROUP;
            case "ANTI_LINK": return settings.ANTI_LINK;
            case "ANTI_BOT": return settings.ANTI_BOT;
            case "ALIVE": return settings.ALIVE;
            case "FOOTER": return settings.FOOTER;
            case "LOGO": return settings.LOGO;
            default: return null;
        }
    } catch (error) {
        console.error('get error:', error);
        return null;
    }
}

async function updb() {
    try {
        const settings = await Settings.findOne();
        if (settings) {
            config.LANG = settings.LANG;
            config.MAX_SIZE = Number(settings.MAX_SIZE);
            config.ALIVE = settings.ALIVE;
            config.FOOTER = settings.FOOTER;
            config.LOGO = settings.LOGO;
            config.ANTI_BAD = settings.ANTI_BAD;
            config.ONLY_GROUP = settings.ONLY_GROUP;
            config.ANTI_LINK = settings.ANTI_LINK;
            config.ANTI_BOT = settings.ANTI_BOT;
            console.log("✅ Config updated from MongoDB");
        }
    } catch (error) {
        console.error('updb error:', error);
    }
}

async function updfb() {
    try {
        await Settings.findOneAndUpdate({}, {
            LANG: 'EN',
            ANTI_BAD: [],
            MAX_SIZE: 100,
            ONLY_GROUP: false,
            ANTI_LINK: [],
            ANTI_BOT: [],
            ALIVE: 'default',
            FOOTER: '𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳',
            LOGO: 'https://files.catbox.moe/bm2v7m.jpg'
        }, { upsert: true });
        
        config.LANG = 'EN';
        config.MAX_SIZE = 100;
        config.ALIVE = 'default';
        config.FOOTER = 'ᴍɪɴɪ ɪɴᴄᴏɴɴᴜ xᴅ ᴠ²';
        config.LOGO = 'https://files.catbox.moe/90i7j4.png';
        config.ANTI_BAD = [];
        config.ONLY_GROUP = false;
        config.ANTI_LINK = [];
        config.ANTI_BOT = [];
        
        console.log("✅ Database reset to default");
    } catch (error) {
        console.error('updfb error:', error);
    }
}

// ==================== BUTTON STORE FUNCTIONS ====================

async function updateCMDStore(MsgID, CmdID) {
    try {
        await ButtonStore.findOneAndUpdate(
            { MsgID: MsgID },
            { MsgID: MsgID, CmdID: CmdID },
            { upsert: true }
        );
        return true;
    } catch (error) {
        console.error('updateCMDStore error:', error);
        return false;
    }
}

async function isbtnID(MsgID) {
    try {
        const found = await ButtonStore.findOne({ MsgID: MsgID });
        return !!found;
    } catch (error) {
        console.error('isbtnID error:', error);
        return false;
    }
}

async function getCMDStore(MsgID) {
    try {
        const found = await ButtonStore.findOne({ MsgID: MsgID });
        return found ? found.CmdID : false;
    } catch (error) {
        console.error('getCMDStore error:', error);
        return false;
    }
}

function getCmdForCmdId(CMD_ID_MAP, cmdId) {
    const result = CMD_ID_MAP.find((entry) => entry.cmdId === cmdId);
    return result ? result.cmd : null;
}

// ==================== SESSION FUNCTIONS ====================

async function saveSessionToMongoDB(number, creds) {
    try {
        await Session.findOneAndUpdate(
            { number: number },
            { number: number, creds: creds, updatedAt: Date.now() },
            { upsert: true }
        );
        console.log(`✅ Session saved to MongoDB for ${number}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to save session for ${number}:`, error);
        return false;
    }
}

async function getSessionFromMongoDB(number) {
    try {
        const session = await Session.findOne({ number: number });
        return session ? session.creds : null;
    } catch (error) {
        console.error(`❌ Failed to get session for ${number}:`, error);
        return null;
    }
}

async function deleteSessionFromMongoDB(number) {
    try {
        await Session.deleteOne({ number: number });
        console.log(`✅ Session deleted from MongoDB for ${number}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to delete session for ${number}:`, error);
        return false;
    }
}

// ==================== USER CONFIG FUNCTIONS ====================

async function getUserConfigFromMongoDB(number) {
    try {
        const config = await UserConfig.findOne({ number: number });
        return config ? config.toObject() : null;
    } catch (error) {
        console.error(`❌ Failed to get user config for ${number}:`, error);
        return null;
    }
}

async function updateUserConfigInMongoDB(number, newConfig) {
    try {
        await UserConfig.findOneAndUpdate(
            { number: number },
            { number: number, ...newConfig, updatedAt: Date.now() },
            { upsert: true }
        );
        console.log(`✅ User config updated for ${number}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to update user config for ${number}:`, error);
        return false;
    }
}

// ==================== NUMBERS LIST FUNCTIONS ====================

async function addNumberToMongoDB(number) {
    try {
        await NumbersList.findOneAndUpdate(
            { number: number },
            { number: number, connectedAt: Date.now() },
            { upsert: true }
        );
        console.log(`✅ Number ${number} added to MongoDB list`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to add number ${number}:`, error);
        return false;
    }
}

async function removeNumberFromMongoDB(number) {
    try {
        await NumbersList.deleteOne({ number: number });
        console.log(`✅ Number ${number} removed from MongoDB list`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to remove number ${number}:`, error);
        return false;
    }
}

async function getAllNumbersFromMongoDB() {
    try {
        const numbers = await NumbersList.find({});
        return numbers.map(n => n.number);
    } catch (error) {
        console.error(`❌ Failed to get all numbers:`, error);
        return [];
    }
}

// ==================== OTP FUNCTIONS ====================

async function saveOTPToMongoDB(number, otp, config) {
    try {
        await OTPStore.create({
            number: number,
            otp: otp,
            config: config
        });
        console.log(`✅ OTP saved for ${number}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to save OTP for ${number}:`, error);
        return false;
    }
}

async function verifyOTPFromMongoDB(number, otp) {
    try {
        const otpRecord = await OTPStore.findOne({ number: number, otp: otp });
        
        if (!otpRecord) {
            return { valid: false, error: 'Invalid OTP' };
        }
        
        await OTPStore.deleteOne({ _id: otpRecord._id });
        return { valid: true, config: otpRecord.config };
    } catch (error) {
        console.error(`❌ Failed to verify OTP for ${number}:`, error);
        return { valid: false, error: 'Verification failed' };
    }
}

// ==================== STATS FUNCTIONS ====================

async function incrementStats(number, field) {
    try {
        const update = {};
        if (field === 'commandsUsed') update.commandsUsed = 1;
        if (field === 'messagesReceived') update.messagesReceived = 1;
        if (field === 'groupsInteracted') update.groupsInteracted = 1;
        
        await Stats.findOneAndUpdate(
            { number: number },
            { 
                $inc: update,
                $set: { lastActive: Date.now() }
            },
            { upsert: true }
        );
        return true;
    } catch (error) {
        console.error(`❌ Failed to update stats for ${number}:`, error);
        return false;
    }
}

async function getStatsForNumber(number) {
    try {
        const stats = await Stats.findOne({ number: number });
        return stats || {
            commandsUsed: 0,
            messagesReceived: 0,
            groupsInteracted: 0,
            lastActive: null
        };
    } catch (error) {
        console.error(`❌ Failed to get stats for ${number}:`, error);
        return null;
    }
}

// ==================== AUTO REPLIES FUNCTIONS ====================

async function saveAutoReplyToMongoDB(number, trigger, reply) {
    try {
        const autoReply = await AutoReplies.findOne({ number: number });
        
        if (!autoReply) {
            const newReplies = new Map();
            newReplies.set(trigger, reply);
            await AutoReplies.create({ number: number, replies: newReplies });
        } else {
            autoReply.replies.set(trigger, reply);
            await autoReply.save();
        }
        return true;
    } catch (error) {
        console.error(`❌ Failed to save auto reply for ${number}:`, error);
        return false;
    }
}

async function getAutoRepliesFromMongoDB(number) {
    try {
        const autoReply = await AutoReplies.findOne({ number: number });
        if (!autoReply) return {};
        
        const replies = {};
        autoReply.replies.forEach((value, key) => {
            replies[key] = value;
        });
        return replies;
    } catch (error) {
        console.error(`❌ Failed to get auto replies for ${number}:`, error);
        return {};
    }
}

async function deleteAutoReplyFromMongoDB(number, trigger) {
    try {
        const autoReply = await AutoReplies.findOne({ number: number });
        if (autoReply) {
            autoReply.replies.delete(trigger);
            await autoReply.save();
        }
        return true;
    } catch (error) {
        console.error(`❌ Failed to delete auto reply for ${number}:`, error);
        return false;
    }
}

// ==================== WELCOME MESSAGES FUNCTIONS ====================

async function saveWelcomeMessageToMongoDB(number, welcomeText, leaveText) {
    try {
        await WelcomeMessages.findOneAndUpdate(
            { number: number },
            { number: number, welcome: welcomeText, leave: leaveText },
            { upsert: true }
        );
        return true;
    } catch (error) {
        console.error(`❌ Failed to save welcome message for ${number}:`, error);
        return false;
    }
}

async function getWelcomeMessageFromMongoDB(number) {
    try {
        const welcome = await WelcomeMessages.findOne({ number: number });
        return welcome || null;
    } catch (error) {
        console.error(`❌ Failed to get welcome message for ${number}:`, error);
        return null;
    }
}

// ==================== EXPORTS ====================

module.exports = {
    // Connection
    connectdb,
    
    // Settings
    input,
    get,
    updb,
    updfb,
    
    // Button Store
    updateCMDStore,
    isbtnID,
    getCMDStore,
    getCmdForCmdId,
    
    // Sessions
    saveSessionToMongoDB,
    getSessionFromMongoDB,
    deleteSessionFromMongoDB,
    
    // User Config
    getUserConfigFromMongoDB,
    updateUserConfigInMongoDB,
    
    // Numbers List
    addNumberToMongoDB,
    removeNumberFromMongoDB,
    getAllNumbersFromMongoDB,
    
    // OTP
    saveOTPToMongoDB,
    verifyOTPFromMongoDB,
    
    // Stats
    incrementStats,
    getStatsForNumber,
    
    // Auto Replies
    saveAutoReplyToMongoDB,
    getAutoRepliesFromMongoDB,
    deleteAutoReplyFromMongoDB,
    
    // Welcome Messages
    saveWelcomeMessageToMongoDB,
    getWelcomeMessageFromMongoDB
};
