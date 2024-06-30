const tagAll = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    
    const validCommands = ['tagall'];
    if (!validCommands.includes(cmd)) return;

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;
    
    if (!m.isGroup) return m.reply("*📛 Yo, this command is group-only, homie*");
    if (!botAdmin) return m.reply("*📛 Ayo, the bot gotta be admin to tag all*");
    if (!senderAdmin) return m.reply("*📛 Yo, you need to be an admin to use this command*");

    let message = `🚨 *Attention All Members!* 🚨\n\n*Message:* ${m.body.slice(prefix.length + cmd.length).trim() || 'Yo, listen up!'}\n\n`;

    for (let participant of participants) {
      message += `👉 @${participant.id.split('@')[0]}\n`;
    }

    await gss.sendMessage(m.from, { text: message, mentions: participants.map(a => a.id) }, { quoted: m });
    m.reply(`👌 Just tagged everyone, boss!`);
  } catch (error) {
    console.error('Error:', error);
    m.reply('Dang, something went wrong while tagging everyone. My bad.');
  }
};

export default tagAll;