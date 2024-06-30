import setEnvCommand from '../setvar.js';
import config from '../../config.cjs';

const ownerContact = async (m, gss) => {
  const ownernumber = config.OWNER_NUMBER;
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'owner') {
    try {
      await gss.sendContact(m.from, [ownernumber], m);
      await m.React("✅");
      m.reply("💼 Here's the boss's contact, don't abuse it!");
    } catch (error) {
      console.error('Error sending owner contact:', error);
      m.reply('🚫 Error sending owner contact, try again later.');
      await m.React("❌");
    }
  } else if (cmd === 'setenv') {
    const args = text.split(' ');
    await setEnvCommand(m, args);
  }
};

export default ownerContact;