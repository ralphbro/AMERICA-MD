import config from '../../config.cjs';

const autoblockCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'autoblock') {
    if (!isCreator) return m.reply("*📛 YO, THIS IS FOR THE BOSS ONLY!*");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_BLOCK = true;
      responseMessage = "Aight, Auto-Block is now ON.";
    } else if (text === 'off') {
      config.AUTO_BLOCK = false;
      responseMessage = "Aight, Auto-Block is now OFF.";
    } else {
      responseMessage = "Yo, use it like this:\n- `autoblock on`: Turn Auto-Block ON\n- `autoblock off`: Turn Auto-Block OFF";
    }

    await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
  }
};

export default autoblockCommand;