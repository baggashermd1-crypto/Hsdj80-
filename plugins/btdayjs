const { smd } = require('../lib');
const axios = require('axios');

smd({
    pattern: "bfday",
    alias: ["boyfriendsday", "bflove"],
    desc: "Boyfriend's Day ke liye ek pyara message generate karein.",
    category: "fun",
    filename: __filename
},
async (message) => {
    try {
        // Chat me processing message dikhane ke liye
        await message.reply("_❤️ LOVE MD is processing... Ek pyara message dhoond raha hoon..._");

        // API se data fetch karna
        const url = 'https://apis.xwolf.space/api/fun/boyfriendsday';
        const response = await axios.get(url);

        // Check karna ki data sahi mila ya nahi
        if (response.data && response.data.status === 'success') {
            const textMessage = response.data.result.text;

            // LOVE MD ka stylish reply format
            const finalReply = `✨ *LOVE MD - Boyfriend's Day Special* ✨\n\n"${textMessage}"\n\n_~ Powered by LOVE MD_`;
            
            return await message.reply(finalReply);
        } else {
            return await message.reply("❌ API se response nahi mila. Baad mein try karein.");
        }

    } catch (error) {
        console.error("Error in bfday command:", error);
        return await message.reply("❌ Kuch error aaya hai, please thodi der baad check karein.");
    }
});
