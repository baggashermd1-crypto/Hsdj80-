const { cmd } = require('../command')
const axios = require('axios')
const yts = require('yt-search')

// ═══════════════════════════════════════════════════════════
// 🎵 SONG COMMAND (SINGLE API - EliteProTech)
// ═══════════════════════════════════════════════════════════
cmd({
    pattern: "song",
    alias: ["play", "music", "audio", "aa"],
    desc: "Download YouTube song",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, reply, text }) => {
    try {
        if (!text) {
            return reply("❌ Please provide song name\nExample: .song Shape of You")
        }

        // 🔍 YouTube search
        const search = await yts(text)
        if (!search.videos || !search.videos.length) {
            return reply("❌ No song found!")
        }

        const vid = search.videos[0]

        // 🎨 LOVE-ᎷᎠ STYLE BOX
        const caption = `
*╭ׂ┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
*│ ╌─̇─̣⊰  ᏁᎪᎳᎪᏃ-ᎷᎠ ⊱┈─̇─̣╌*
*│─̇─̣┄┄┄┄┄┄┄┄┄┄┄┄┄─̇─̣*
*│❀ 🎵 𝐓𝐢𝐭𝐥𝐞:* ${vid.title}
*│❀ 📀 𝐐𝐮𝐚𝐥𝐢𝐭𝐲:* 128kbps
*│❀ 📁 𝐅𝐨𝐫𝐦𝐚𝐭:* mp3
*│❀ ⚙️ 𝐒𝐭𝐚𝐭𝐮𝐬:* Downloading...
*╰┄─̣┄─̇─̣┄─̇─̣┄─̇─̣┄─̇─̣─̇─̣─᛭*
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ LOVE-ᎷᎠ`

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption
        }, { quoted: mek })

        // ═══════════════════════════════════════════════════════════
        // 🔷 API: EliteProTech API (Direct MP3)
        // ═══════════════════════════════════════════════════════════
        try {
            const apiUrl = `https://eliteprotech-apis.zone.id/ytmp3?url=${encodeURIComponent(vid.url)}`
            const res = await axios.get(apiUrl, { timeout: 30000 })

            if (!res.data?.status || !res.data?.result?.download) {
                await conn.sendMessage(from, { react: { text: '❌', key: m.key } })
                return reply("❌ API Error! Please try again later.")
            }

            const audioUrl = res.data.result.download
            const audioRes = await axios.get(audioUrl, {
                responseType: 'arraybuffer',
                timeout: 60000
            })
            const audioBuffer = Buffer.from(audioRes.data)

            await conn.sendMessage(from, {
                audio: audioBuffer,
                mimetype: "audio/mpeg",
                fileName: `${vid.title}.mp3`,
                ptt: false
            }, { quoted: mek })

            await conn.sendMessage(from, { react: { text: '✅', key: m.key } })
            console.log(`✅ Song sent successfully!`)

        } catch (e) {
            console.log("❌ API Failed:", e.message)
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } })
            return reply("❌ API Error! Please try again later.")
        }

    } catch (err) {
        console.error("❌ SONG ERROR:", err)
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } })
        reply("❌ API Error! Please try again later.")
    }
})
