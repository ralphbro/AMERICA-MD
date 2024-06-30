import config from '../../config.cjs';

const joinGroup = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();
    const args = text.split(' ');

    const validCommands = ['join'];

    if (!validCommands.includes(cmd)) return;

    if (!isCreator) return m.reply("*📛 Only the big boss can use this command!*");

    if (!text) throw '*Yo, drop the group link!*';
    if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) throw '*INVALID LINK, fam!*';

    m.reply('Hold tight, joining the group... ⏳');
    const result = args[0].split('https://chat.whatsapp.com/')[1];

    await gss.groupAcceptInvite(result)
      .then((res) => m.reply(`*🚀 We in, baby! Joined the group successfully. ${JSON.stringify(res)}*`))
      .catch((err) => m.reply(`*🚫 Couldn't join the group. ${JSON.stringify(err)}*`));
  } catch (error) {
    console.error('Error:', error);
    m.reply('💥 Something went wrong, bro.');
  }
};

const isUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export default joinGroup;