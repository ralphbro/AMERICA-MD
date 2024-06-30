import axios from 'axios';
import { mediafireDl } from 'mfiredlcore-vihangayt';

const mediafireDownload = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['mediafire', 'mf', 'mfdownload'];

  if (validCommands.includes(cmd)) {
    if (!text) return m.reply('Yo, drop a MediaFire link, fam. 📎');

    try {
      await m.react('🕘');

      const mediafireUrl = text;
      const mediafireInfo = await mediafireDl(mediafireUrl);

      if (mediafireInfo && mediafireInfo.link) {
        const mediaUrl = mediafireInfo.link;
        const caption = `> 🇺🇲 Straight from the streets of America 🌎\n> 🗃️ File: ${mediafireInfo.name}\n> 📏 Size: ${mediafireInfo.size}\n> 📅 Date: ${mediafireInfo.date}`;

        const extension = mediaUrl.split('.').pop().toLowerCase();

        await Matrix.sendMedia(m.from, mediaUrl, extension, caption, m);

        await m.react('✅');
      } else {
        throw new Error('Invalid response from MediaFire.');
      }
    } catch (error) {
      console.error('Error downloading MediaFire file:', error.message);
      m.reply('Yo, something went wrong with the download. ❌');
      await m.react('❌');
    }
  }
};

export default mediafireDownload;