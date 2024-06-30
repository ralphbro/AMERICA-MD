import config from '../../config.cjs';
import fs from 'fs';
import path from 'path';

const modeCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'mode') {
    if (!isCreator) return m.reply("📛 Yo, only the boss can do this!");

    let responseMessage;

    if (['public', 'private'].includes(text)) {
      config.MODE = text;
      responseMessage = `Mode has been flipped to ${text.toUpperCase()}, baby! 🚦`;

      // Write the updated config back to the file
      try {
        const __filename = new URL(import.meta.url).pathname;
        const __dirname = path.dirname(__filename);
        const configPath = path.resolve(__dirname, '../../config.cjs');
        fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};`, 'utf-8');
      } catch (error) {
        console.error("Error writing to config file:", error);
        responseMessage = '⚠️ Error updating configuration file. Oops!';
      }
    } else {
      responseMessage = "Usage:\n- `mode public`: 🌐 Set mode to public\n- `mode private`: 🔒 Set mode to private";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: '⚠️ Error processing your request. My bad!' }, { quoted: m });
    }
  }
};

export default modeCommand;