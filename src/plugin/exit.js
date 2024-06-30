import config from '../../config.cjs';

const leaveGroup = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    
    const validCommands = ['leave', 'exit', 'left'];

    if (!validCommands.includes(cmd)) return;
    
    if (!m.isGroup) return m.reply("*📛 Yo, you can only use this command in groups*");

    if (!isCreator) return m.reply("*📛 Yo, only the boss can make me leave*");

    await gss.groupLeave(m.from);
    m.reply('*🚶‍♂️ Peace out, homies. Im outta here!*');
  } catch (error) {
    console.error('Error:', error);
  }
};

export default leaveGroup;