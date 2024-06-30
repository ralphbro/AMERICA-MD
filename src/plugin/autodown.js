import config from '../../config.cjs';

const autodlCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'autodl') {
    if (!isCreator) return m.reply("*📛 YO, THIS IS FOR THE BOSS ONLY!*");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_DL = true;
      responseMessage = "Aight, Auto-Download is now ON.";
    } else if (text === 'off') {
      config.AUTO_DL = false;
      responseMessage = "Aight, Auto-Download is now OFF.";
    } else {
      responseMessage = "Yo, use it like this:\n- `autodl on`: Turn Auto-Download ON\n- `autodl off`: Turn Auto-Download OFF";
    }

    await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
  }
};

export default autodlCommand;