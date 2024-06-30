
// antilink.js
import { serialize } from '../../lib/Serializer.js';

const antilinkSettings = {}; // In-memory database to store antilink settings for each chat

export const handleAntilink = async (m, sock, logger, isBotAdmins, isAdmins, isCreator) => {
    const PREFIX = /^[\\/!#.]/;
    const isCOMMAND = (body) => PREFIX.test(body);
    const prefixMatch = isCOMMAND(m.body) ? m.body.match(PREFIX) : null;
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd === 'antilink') {
        const args = m.body.slice(prefix.length + cmd.length).trim().split(/\s+/);
        const action = args[0] ? args[0].toLowerCase() : '';

        if (!m.isGroup) {
            await sock.sendMessage(m.from, { text: 'This command can only be used in groups.' }, { quoted: m });
            return;
        }

        if (!isBotAdmins) {
            await sock.sendMessage(m.from, { text: 'The bot needs to be an admin to manage the antilink feature.' }, { quoted: m });
            return;
        }

        if (action === 'on') {
            if (isAdmins) {
                antilinkSettings[m.from] = true;
                await sock.sendMessage(m.from, { text: 'Antilink feature has been enabled for this chat.' }, { quoted: m });
            } else {
                await sock.sendMessage(m.from, { text: 'Only admins can enable the antilink feature.' }, { quoted: m });
            }
            return;
        }

        if (action === 'off') {
            if (isAdmins) {
                antilinkSettings[m.from] = false;
                await sock.sendMessage(m.from, { text: 'Antilink feature has been disabled for this chat.' }, { quoted: m });
            } else {
                await sock.sendMessage(m.from, { text: 'Only admins can disable the antilink feature.' }, { quoted: m });
            }
            return;
        }

        await sock.sendMessage(m.from, { text: `Usage: ${prefix + cmd} on\n ${prefix + cmd} off` }, { quoted: m });
        return;
    }

    if (antilinkSettings[m.from]) {
        if (m.body.match(/https:\/\/[^\s]+/gi)) {
            if (!isBotAdmins) {
                await sock.sendMessage(m.from, { text: `The bot needs to be an admin to remove links.` });
                return;
            }

            if (isAdmins) {
                await sock.sendMessage(m.from, { text: `Admins are allowed to share links.` });
                return;
            }
            if (isCreator) {
                await sock.sendMessage(m.from, { text: `The owner is allowed to share links.` });
                return;
            }

            // Delete the message containing the link
            await sock.sendMessage(m.from, { delete: m.key });

            // Send warning message first
            await sock.sendMessage(m.from, {
                text: `\`\`\`「 Ayooo 」\`\`\`\n\n@${m.sender.split("@")[0]}, why do you send this crap link in the group👀? now I'm going to delete you from the group 😏 .`,
                contextInfo: { mentionedJid: [m.sender] }
            }, { quoted: m });

            // Wait for a short duration before kicking
            setTimeout(async () => {
                await sock.groupParticipantsUpdate(m.from, [m.sender], 'remove');
            }, 5000); // 5 seconds delay before kick
        }
    }
};