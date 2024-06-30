import config from '../../config.cjs';

// Main command function
const anticallcommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'anticall') {
    if (!isCreator) return m.reply("*🚫 Hey! This one's for the big boss only!*");
    let responseMessage;

    if (text === 'on') {
      config.REJECT_CALL = true;
      responseMessage = "Alright, Anti-Call is now active.";
    } else if (text === 'off') {
      config.REJECT_CALL = false;
      responseMessage = "Okay, Anti-Call is now inactive.";
    } else {
      responseMessage = "Here's how you roll:\n- `anticall on`: Activate Anti-Call\n- `anticall off`: Deactivate Anti-Call";
    }

    await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
  }
};

export default anticallcommand;