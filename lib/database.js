const mongoose = require('mongoose');
const config = require('../config');

// MongoDB Connection URI - from config or environment
const MONGODB_URI = process.env.MONGODB_URI || config.MONGODB_URI || 'mongodb+srv://kxshrii:i7sgjXF6SO2cTJwU@kelumxz.zggub8h.mongodb.net/sila_md_bot';

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
    LOGO: { type: String, default: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg' }
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
    RCD_IMAGE_PATH: { type: String, default: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg' },
    NEWSLETTER_JID: { type: String, default: '120363402325089913@newsletter' },
    NEWSLETTER_MESSAGE_ID: { type: String, default: '428' },
    OTP_EXPIRY: { type: Number, default: 300000 },
    OWNER_NUMBER: { type: String, default: '255612491554' },
    CHANNEL_LINK: { type: String, default: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02' },
    REJECT_MSG: { type: String, default: 'Please don\'t call me! 😊' },
    BIO_LIST: { type: Array, default: [
        "🐢 SILA-MD-MINI | 🤖 AI Assistant",
        "🌟 Powered by SILA TECH | 🚀 Fast & Reliable",
        "💫 SILA-MD-MINI Bot | Always Active!",
        "👑 SILA TECH | Mini WhatsApp Bot"
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
    createdAt: { type: Date, default: Date.now, expires: 300 }
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

// Blacklist Schema
const blacklistSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    reason: { type: String, default: 'No reason provided' },
    bannedAt: { type: Date, default: Date.now }
});

// Sudo/Admin Users Schema
const sudoUsersSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    addedAt: { type: Date, default: Date.now },
    addedBy: { type: String, default: '' }
});

// Group Settings Schema
const groupSettingsSchema = new mongoose.Schema({
    groupId: { type: String, required: true, unique: true },
    antilink: { type: Boolean, default: false },
    antispam: { type: Boolean, default: false },
    welcome: { type: Boolean, default: true },
    goodbye: { type: Boolean, default: true },
    nsfw: { type: Boolean, default: false },
    economy: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Economy Schema
const economySchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    lastDaily: { type: Date, default: null },
    lastWork: { type: Date, default: null },
    inventory: { type: Array, default: [] }
});

// ==================== MODELS ====================

let Settings, ButtonStore, Session, UserConfig, NumbersList, OTPStore, Stats, AutoReplies, WelcomeMessages;
let Blacklist, SudoUsers, GroupSettings, Economy;

// ==================== CONNECTION FUNCTION ====================

let currentMongoURI = MONGODB_URI;
let isConnected = false;

const connectdb = async () => {
    try {
        if (isConnected) {
            console.log('✅ MongoDB already connected');
            return true;
        }
        
        await mongoose.connect(currentMongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
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
        Blacklist = mongoose.model('Blacklist', blacklistSchema);
        SudoUsers = mongoose.model('SudoUser', sudoUsersSchema);
        GroupSettings = mongoose.model('GroupSetting', groupSettingsSchema);
        Economy = mongoose.model('Economy', economySchema);
        
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
                LOGO: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg'
            });
            console.log('✅ Default settings created in MongoDB');
        }
        
        isConnected = true;
        console.log('✅ MongoDB Connected Successfully!');
        
        // Update global config
        await updb();
        
        return true;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        isConnected = false;
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
                global.config.LANG = data;
                break;
            case "ANTI_BAD":
                settings.ANTI_BAD = data;
                global.config.ANTI_BAD = data;
                break;
            case "MAX_SIZE":
                settings.MAX_SIZE = data;
                global.config.MAX_SIZE = data;
                break;
            case "ONLY_GROUP":
                settings.ONLY_GROUP = data;
                global.config.ONLY_GROUP = data;
                break;
            case "ANTI_LINK":
                settings.ANTI_LINK = data;
                global.config.ANTI_LINK = data;
                break;
            case "ANTI_BOT":
                settings.ANTI_BOT = data;
                global.config.ANTI_BOT = data;
                break;
            case "ALIVE":
                settings.ALIVE = data;
                global.config.ALIVE = data;
                break;
            case "FOOTER":
                settings.FOOTER = data;
                global.config.FOOTER = data;
                break;
            case "LOGO":
                settings.LOGO = data;
                global.config.LOGO = data;
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
            if (global.config) {
                global.config.LANG = settings.LANG;
                global.config.MAX_SIZE = Number(settings.MAX_SIZE);
                global.config.ALIVE = settings.ALIVE;
                global.config.FOOTER = settings.FOOTER;
                global.config.LOGO = settings.LOGO;
                global.config.ANTI_BAD = settings.ANTI_BAD;
                global.config.ONLY_GROUP = settings.ONLY_GROUP;
                global.config.ANTI_LINK = settings.ANTI_LINK;
                global.config.ANTI_BOT = settings.ANTI_BOT;
            }
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
            LOGO: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg'
        }, { upsert: true });
        
        if (global.config) {
            global.config.LANG = 'EN';
            global.config.MAX_SIZE = 100;
            global.config.ALIVE = 'default';
            global.config.FOOTER = '𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳';
            global.config.LOGO = 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg';
            global.config.ANTI_BAD = [];
            global.config.ONLY_GROUP = false;
            global.config.ANTI_LINK = [];
            global.config.ANTI_BOT = [];
        }
        
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

async function getAllUserConfigs() {
    try {
        return await UserConfig.find({});
    } catch (error) {
        console.error('❌ Failed to get all user configs:', error);
        return [];
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

async function getAllStats() {
    try {
        return await Stats.find({});
    } catch (error) {
        console.error('❌ Failed to get all stats:', error);
        return [];
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
        console.log(`✅ Auto reply saved for ${number}: ${trigger} -> ${reply}`);
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
            console.log(`✅ Auto reply deleted for ${number}: ${trigger}`);
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
        console.log(`✅ Welcome message saved for ${number}`);
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

// ==================== BLACKLIST FUNCTIONS ====================

async function addToBlacklist(number, reason = 'No reason provided', addedBy = 'system') {
    try {
        await Blacklist.findOneAndUpdate(
            { number: number },
            { number: number, reason: reason, addedBy: addedBy, bannedAt: Date.now() },
            { upsert: true }
        );
        console.log(`✅ ${number} added to blacklist`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to add ${number} to blacklist:`, error);
        return false;
    }
}

async function removeFromBlacklist(number) {
    try {
        await Blacklist.deleteOne({ number: number });
        console.log(`✅ ${number} removed from blacklist`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to remove ${number} from blacklist:`, error);
        return false;
    }
}

async function isBlacklisted(number) {
    try {
        const blacklisted = await Blacklist.findOne({ number: number });
        return !!blacklisted;
    } catch (error) {
        console.error(`❌ Failed to check blacklist for ${number}:`, error);
        return false;
    }
}

async function getAllBlacklisted() {
    try {
        return await Blacklist.find({});
    } catch (error) {
        console.error('❌ Failed to get blacklisted users:', error);
        return [];
    }
}

// ==================== SUDO USERS FUNCTIONS ====================

async function addSudoUser(number, name = '', addedBy = 'system') {
    try {
        await SudoUsers.findOneAndUpdate(
            { number: number },
            { number: number, name: name, addedBy: addedBy, addedAt: Date.now() },
            { upsert: true }
        );
        console.log(`✅ ${number} added as sudo user`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to add sudo user ${number}:`, error);
        return false;
    }
}

async function removeSudoUser(number) {
    try {
        await SudoUsers.deleteOne({ number: number });
        console.log(`✅ ${number} removed from sudo users`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to remove sudo user ${number}:`, error);
        return false;
    }
}

async function isSudoUser(number) {
    try {
        const sudoUser = await SudoUsers.findOne({ number: number });
        return !!sudoUser;
    } catch (error) {
        console.error(`❌ Failed to check sudo user for ${number}:`, error);
        return false;
    }
}

async function getAllSudoUsers() {
    try {
        return await SudoUsers.find({});
    } catch (error) {
        console.error('❌ Failed to get sudo users:', error);
        return [];
    }
}

// ==================== GROUP SETTINGS FUNCTIONS ====================

async function setGroupSetting(groupId, setting, value) {
    try {
        const update = {};
        update[setting] = value;
        
        await GroupSettings.findOneAndUpdate(
            { groupId: groupId },
            { groupId: groupId, ...update },
            { upsert: true }
        );
        console.log(`✅ Group setting updated for ${groupId}: ${setting} = ${value}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to update group setting for ${groupId}:`, error);
        return false;
    }
}

async function getGroupSetting(groupId, setting) {
    try {
        const settings = await GroupSettings.findOne({ groupId: groupId });
        if (!settings) return null;
        return settings[setting];
    } catch (error) {
        console.error(`❌ Failed to get group setting for ${groupId}:`, error);
        return null;
    }
}

async function getAllGroupSettings() {
    try {
        return await GroupSettings.find({});
    } catch (error) {
        console.error('❌ Failed to get group settings:', error);
        return [];
    }
}

// ==================== ECONOMY FUNCTIONS ====================

async function getEconomy(userId) {
    try {
        let economy = await Economy.findOne({ userId: userId });
        if (!economy) {
            economy = await Economy.create({ userId: userId });
        }
        return economy;
    } catch (error) {
        console.error(`❌ Failed to get economy for ${userId}:`, error);
        return null;
    }
}

async function updateBalance(userId, amount) {
    try {
        const economy = await getEconomy(userId);
        if (!economy) return false;
        
        economy.balance += amount;
        await economy.save();
        return true;
    } catch (error) {
        console.error(`❌ Failed to update balance for ${userId}:`, error);
        return false;
    }
}

async function updateBank(userId, amount) {
    try {
        const economy = await getEconomy(userId);
        if (!economy) return false;
        
        economy.bank += amount;
        await economy.save();
        return true;
    } catch (error) {
        console.error(`❌ Failed to update bank for ${userId}:`, error);
        return false;
    }
}

async function setLastDaily(userId, date) {
    try {
        const economy = await getEconomy(userId);
        if (!economy) return false;
        
        economy.lastDaily = date;
        await economy.save();
        return true;
    } catch (error) {
        console.error(`❌ Failed to set last daily for ${userId}:`, error);
        return false;
    }
}

async function setLastWork(userId, date) {
    try {
        const economy = await getEconomy(userId);
        if (!economy) return false;
        
        economy.lastWork = date;
        await economy.save();
        return true;
    } catch (error) {
        console.error(`❌ Failed to set last work for ${userId}:`, error);
        return false;
    }
}

// ==================== MONGODB URI MANAGEMENT ====================

async function updateMongoDBURI(newURI) {
    try {
        currentMongoURI = newURI;
        await mongoose.disconnect();
        isConnected = false;
        await mongoose.connect(newURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isConnected = true;
        console.log('✅ MongoDB URI updated and reconnected');
        return true;
    } catch (error) {
        console.error('❌ Failed to update MongoDB URI:', error);
        return false;
    }
}

async function getMongoDBURI() {
    return currentMongoURI;
}

async function getConnectionStatus() {
    return {
        isConnected: isConnected,
        uri: currentMongoURI,
        readyState: mongoose.connection.readyState
    };
}

// ==================== EXPORTS ====================

module.exports = {
    // Connection
    connectdb,
    getConnectionStatus,
    
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
    getAllUserConfigs,
    
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
    getAllStats,
    
    // Auto Replies
    saveAutoReplyToMongoDB,
    getAutoRepliesFromMongoDB,
    deleteAutoReplyFromMongoDB,
    
    // Welcome Messages
    saveWelcomeMessageToMongoDB,
    getWelcomeMessageFromMongoDB,
    
    // Blacklist
    addToBlacklist,
    removeFromBlacklist,
    isBlacklisted,
    getAllBlacklisted,
    
    // Sudo Users
    addSudoUser,
    removeSudoUser,
    isSudoUser,
    getAllSudoUsers,
    
    // Group Settings
    setGroupSetting,
    getGroupSetting,
    getAllGroupSettings,
    
    // Economy
    getEconomy,
    updateBalance,
    updateBank,
    setLastDaily,
    setLastWork,
    
    // MongoDB URI
    updateMongoDBURI,
    getMongoDBURI
};
