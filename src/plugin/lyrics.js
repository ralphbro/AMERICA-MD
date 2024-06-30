import { lyrics, lyricsv2 } from '@bochilteam/scraper';

const lyricsCommand = async (m, Matrix) => {
  try {
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['lyrics'];
    if (!validCommands.includes(cmd)) return;

    if (!text) {
      return m.reply('Yo, give me a song name to get the lyrics, fam. 🎤');
    }

    m.reply('Hold tight, searching for those lyrics... 🎶');

    const result = await lyricsv2(text).catch(async () => await lyrics(text));

    if (!result) {
      return m.reply('No lyrics found for that song, bro. 🤷‍♂️');
    }

    const replyMessage = `
      *✍️ Title:* ${result.title}
      *👨‍🎤 Artist:* ${result.author}
      *🔗 Link:* ${result.link}

      *📝 Lyrics:*\n\n ${result.lyrics}
    `.trim();

    m.reply(replyMessage);

  } catch (error) {
    console.error('Error:', error);
    m.reply('Oops, something went wrong while getting the lyrics. 💥');
  }
};

export default lyricsCommand;