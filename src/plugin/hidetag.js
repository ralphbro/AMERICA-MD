const tagall = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    
    const validCommands = ['hidetag'];
    if (!validCommands.includes(cmd)) return;

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;
    
    if (!m.isGroup) return m.reply("🚫 Yo, this command only works in groups, my dude!");
    if (!botAdmin) return m.reply("👮‍♂️ The bot's gotta be an admin to use this command!");
    if (!senderAdmin) return m.reply("🙅‍♂️ You ain't an admin, you can't use this!");

    let message = `📢 *Yo, Listen Up!* 📢\n\n*Message:* ${m.body.slice(prefix.length + cmd.length).trim() || 'No message'}\n\n`;
        
    for (let participant of participants) {
      message += `👉 @${participant.id.split('@')[0]}\n`;
    }

    gss.sendMessage(m.from, { text: message, mentions: participants.map(a => a.id) }, { quoted: m });
  } catch (error) {
    console.error('Error:', error);
    await m.reply('💥 Oops! Something went wrong with the command.');
  }
};

export default tagall;