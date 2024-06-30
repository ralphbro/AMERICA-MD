const linkgc = async (m, gss) => {
  try {
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    const validCommands = ['linkgc', 'grouplink'];

    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) {
      return m.reply('*📛 Yo, this command only works in groups!*');
    }
    const groupMetadata = await gss.groupMetadata(m.from);
    const botNumber = await gss.decodeJid(gss.user.id);
    const isBotAdmins = groupMetadata.participants.find(p => p.id === botNumber)?.admin;

    if (!isBotAdmins) {
      return m.reply('*📛 The bot needs to be an admin to do this, homie.*');
    }

    const response = await gss.groupInviteCode(m.from);
    await gss.sendMessage(m.from, {
      text: `🚀 Check it out: https://chat.whatsapp.com/${response}\n\nGroup Link: ${groupMetadata.subject} 💬`,
      detectLink: true
    });

  } catch (error) {
    console.error('Error:', error);
    m.reply('💥 Oops, something went wrong.');
  }
};

export default linkgc;