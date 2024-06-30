import fs from 'fs/promises';
import config from '../../config.cjs';

const stickerCommand = async (m, gss) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const packname = "";
  const author = "andy_mr_lit";

  const validCommands = ['sticker', 's'];

  if (validCommands.includes(cmd)) {
    const quoted = m.quoted || {}; // Check if there's a quoted message

    // Check if the quoted message is an image or a video
    if (!quoted || (quoted.mtype !== 'imageMessage' && quoted.mtype !== 'videoMessage')) {
      return m.reply(`Hey, send/reply with an image or video to make a dope sticker ${prefix + cmd}`);
    }

    try {
      const media = await quoted.download(); // Download the media from the quoted message
      if (!media) throw new Error('Failed to download media.');

      const filePath = `./${Date.now()}.${quoted.mtype === 'imageMessage' ? 'png' : 'mp4'}`; // Define the file path for saving the image or video
      await fs.writeFile(filePath, media); // Save the media to the file system

      if (quoted.mtype === 'imageMessage') {
        const stickerBuffer = await fs.readFile(filePath); // Read the saved image from the file system
        await gss.sendImageAsSticker(m.from, stickerBuffer, m, { packname: packname, author: author });
        m.reply(`🤙 Sent a fresh sticker, homie!`);
      } else if (quoted.mtype === 'videoMessage') {
        await gss.sendVideoAsSticker(m.from, filePath, m, { packname: packname, author: author });
        m.reply(`🔥 Just turned that video into a sticker! Check it out.`);
      }
    } catch (error) {
      console.error("Error sending sticker:", error);
      await m.reply('Dang, there was an issue making that sticker. My bad.');
    }
  }
};

export default stickerCommand;