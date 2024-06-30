import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const reminiPath = path.resolve(__dirname, '../remini.cjs');
const { remini } = require(reminiPath);

const tourl = async (m, gss) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const validCommands = ['hdr', 'hd', 'remini', 'enhance', 'upscale'];

  if (validCommands.includes(cmd)) {
    if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
      return m.reply(`*📸 Yo, send or reply with an image to enhance your pic with ${prefix + cmd}*`);
    }
    
    const media = await m.quoted.download();

    try {
      let proses = await remini(media, "enhance"); // Call remini directly
      gss.sendMessage(m.from, { image: proses, caption: `🌟 Yo ${m.pushName}, here’s your enhanced image! Courtesy of Mrlit Andy 💪` }, { quoted: m });
    } catch (error) {
      console.error('Error processing media:', error);
      m.reply('💥 Whoops! Something went wrong while processing your image.');
    }
  }
};

export default tourl;