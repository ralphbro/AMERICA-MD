import config from '../../config.cjs';

const autoreactCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'autoreact') {
    if (!isCreator) return m.reply("*📛 YO, THIS IS FOR THE BOSS ONLY!*");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_REACT = true;
      responseMessage = "Aight, Auto-React is now ON.";
    } else if (text === 'off') {
      config.AUTO_REACT = false;
      responseMessage = "Aight, Auto-React is now OFF.";
    } else {
      responseMessage = "Yo, use it like this:\n- `autoreact on`: Turn Auto-React ON\n- `autoreact off`: Turn Auto-React OFF";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default autoreactCommand;