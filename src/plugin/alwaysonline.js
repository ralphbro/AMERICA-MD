import config from '../../config.cjs';

const alwaysonlineCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'alwaysonline') {
    if (!isCreator) return m.reply("*📛 YO, THIS IS FOR THE BOSS ONLY!*");
    let responseMessage;

    if (text === 'on') {
      config.ALWAYS_ONLINE = true;
      responseMessage = "Aight, Always Online is now ON.";
    } else if (text === 'off') {
      config.ALWAYS_ONLINE = false;
      responseMessage = "Aight, Always Online is now OFF.";
    } else {
      responseMessage = "Yo, use it like this:\n- `alwaysonline on`: Turn Always Online ON\n- `alwaysonline off`: Turn Always Online OFF";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Yo, there was an error processin your request.' }, { quoted: m });
    }
  }
};

export default alwaysonlineCommand;