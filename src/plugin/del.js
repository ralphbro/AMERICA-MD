import config from '../../config.cjs';

const deleteMessage = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isBoss = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    const validCommands = ['del', 'delete'];

    if (validCommands.includes(cmd)) {
      if (!isBoss) {
        return m.reply("*📛 Yo, only the boss can do this!*");
      }

      if (!m.quoted) {
        return m.reply('✳️ Reply to the message you want to delete, fool.');
      }

      const key = {
        remoteJid: m.from,
        id: m.quoted.key.id,
        participant: m.quoted.key.participant || m.quoted.key.remoteJid
      };

      await gss.sendMessage(m.from, { delete: key });
      m.reply('🗑️ Message deleted like a G.');
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    m.reply('An error occurred while trying to delete the message, homie.');
  }
};

export default deleteMessage;