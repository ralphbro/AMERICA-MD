import config from '../../config.cjs';

// Main command function
const autotypingCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'autotyping') {
    if (!isCreator) return m.reply("*📛 Yo, this one's for the boss only!*");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_TYPING = true;
      responseMessage = "💬 Auto-Typing is now ON.";
    } else if (text === 'off') {
      config.AUTO_TYPING = false;
      responseMessage = "💬 Auto-Typing is now OFF.";
    } else {
      responseMessage = `Yo, here's how you use it:\n- *${prefix + cmd} on:* Enable Auto-Typing\n- *${prefix + cmd} off:* Disable Auto-Typing`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default autotypingCommand;