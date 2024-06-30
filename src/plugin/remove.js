const kick = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['kick', 'remove'];

    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) return m.reply("Hey, this command only works in groups, fool.");
    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("Yo, I gotta be an admin to kick someone outta here.");
    if (!senderAdmin) return m.reply("Nah, you ain't an admin. You can't do that.");

    if (!m.mentionedJid) m.mentionedJid = [];

    if (m.quoted?.participant) m.mentionedJid.push(m.quoted.participant);

    const users = m.mentionedJid.length > 0
      ? m.mentionedJid
      : text.replace(/[^0-9]/g, '').length > 0
      ? [text.replace(/[^0-9]/g, '') + '@s.whatsapp.net']
      : [];

    if (users.length === 0) {
      return m.reply("Yo, mention or quote a user if you wanna kick them.");
    }

    const validUsers = users.filter(Boolean);

    await gss.groupParticipantsUpdate(m.from, validUsers, 'remove')
      .then(() => {
        const kickedNames = validUsers.map(user => `@${user.split("@")[0]}`);
        m.reply(`Haha, ${kickedNames} just got kicked outta ${groupMetadata.subject}. Don't mess around here!`);
      })
      .catch(() => m.reply("Couldn't kick user(s) from the group. Something messed up, yo."));
  } catch (error) {
    console.error('Error:', error);
    m.reply('Aight, something went wrong with the command. My bad.');
  }
};

export default kick;