import config from '../../config.cjs';

const autoreadCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'autoread') {
    if (!isCreator) return m.reply("*📛 Yo, only the boss can do this!*");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_READ = true;
      responseMessage = "Aight, Auto-Read is now ON.";
    } else if (text === 'off') {
      config.AUTO_READ = false;
      responseMessage = "Aight, Auto-Read is now OFF.";
    } else {
      responseMessage = "Yo, use it like this:\n- `autoread on`: Turn Auto-Read ON\n- `autoread off`: Turn Auto-Read OFF";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default autoreadCommand;