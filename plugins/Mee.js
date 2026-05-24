// plugins/mention.js - CommonJS Version
const { cmd } = require('../command');
const config = require('../config');
const converter = require('../lib/converter');
const path = require('path');
const axios = require('axios');

// VoiceClip urls
const voiceClips = [
    'https://d.uguu.se/WqLiixNk.mp3',
    'https://n.uguu.se/FEmDjgbl.mp3',
    'https://n.uguu.se/JDgmiMwb.mp3',
    'https://h.uguu.se/PSnLhROQ.mp3',
    'https://d.uguu.se/WqLiixNk.mp3',
    'https://n.uguu.se/XlJLdaJJ.mp3',
    'https://n.uguu.se/rSvTpQWy.mp3',
    'https://d.uguu.se/eelMDjaO.mp3',
    'https://d.uguu.se/sfUQYfur.mp3',
    'https://h.uguu.se/pZRQUQUK.mp3',
    'https://h.uguu.se/odLPxRJX.mp3',
    'https://h.uguu.se/XUQrFvft.mp3',
    'https://d.uguu.se/xdkDoOvK.mp3',
    'https://n.uguu.se/phwWTDRZ.mp3',
    'https://n.uguu.se/FEmDjgbl.mp3',
    'https://d.uguu.se/wrCWZbsw.mp3'
];

// Fixed delay of 3 seconds
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to fetch audio buffer
async function fetchAudioBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
    } catch (error) {
        console.error('Error fetching audio:', error);
        throw error;
    }
}

// 1. Auto reply when bot is mentioned in group
cmd({
    on: "body"
}, async (conn, m, store, { isGroup, botNumber2, userConfig }) => {
    try {
        const mek = m.mek || m;
        if (mek.key?.fromMe) return;

        // Get MENTION_REPLY from userConfig if available, otherwise use config.MENTION_REPLY
        const MENTION_REPLY = userConfig?.MENTION_REPLY || config.MENTION_REPLY || 'false';
        
        if (MENTION_REPLY !== 'true' || !isGroup || !botNumber2) return;

        const mentioned = m.mentionedJid || [];
        if (!mentioned.includes(botNumber2)) return;

        const chatId = m.chat;

        // Show recording animation
        await conn.sendPresenceUpdate('recording', chatId);

        // Select random clip
        const randomClip = voiceClips[Math.floor(Math.random() * voiceClips.length)];

        // Fetch audio using axios
        const audioBuffer = await fetchAudioBuffer(randomClip);

        // Fixed 3-second delay before converting
        await delay(3000);

        // Convert to PTT if converter function exists
        let pttAudio;
        if (typeof converter.toPTT === 'function') {
            pttAudio = await converter.toPTT(audioBuffer, 'mp3');
        } else if (typeof converter === 'function') {
            pttAudio = await converter(audioBuffer, 'mp3');
        } else {
            pttAudio = audioBuffer;
        }

        // Send voice note
        await conn.sendMessage(chatId, {
            audio: pttAudio,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: m });

    } catch (e) {
        console.error('Error in mention reply:', e);
    }
});

// 2. Command: .mee / .me
cmd({
    pattern: "mee",
    alias: ["me"],
    desc: "Send a random voice message",
    category: "other",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, reply, userConfig }) => {
    try {
        const chatId = from;

        // Show recording animation
        await conn.sendPresenceUpdate('recording', chatId);

        // Select random clip
        const randomClip = voiceClips[Math.floor(Math.random() * voiceClips.length)];

        // Fetch audio using axios
        const audioBuffer = await fetchAudioBuffer(randomClip);

        // Fixed 3-second delay before converting
        await delay(3000);

        // Convert to PTT if converter function exists
        let pttAudio;
        if (typeof converter.toPTT === 'function') {
            pttAudio = await converter.toPTT(audioBuffer, 'mp3');
        } else if (typeof converter === 'function') {
            pttAudio = await converter(audioBuffer, 'mp3');
        } else {
            pttAudio = audioBuffer;
        }

        // Send voice note
        await conn.sendMessage(chatId, {
            audio: pttAudio,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: m });

    } catch (e) {
        console.error('Error in mention command:', e);
        await reply(`❌ Error: ${e.message}`);
    }
});
