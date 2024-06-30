const invite = async (m, gss) => {
  try {
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    const validCommands = ['invite', 'add'];

    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) return m.reply("*🚫 Yo, this command only works in groups!*");

    const text = m.body.slice(prefix.length + cmd.length).trim();

    const group = m.from;
    const groupMetadata = await gss.groupMetadata(group);
    const botNumber = await gss.decodeJid(gss.user.id);
    const isBotAdmins = groupMetadata.participants.find(p => p.id === botNumber)?.admin;

    if (!isBotAdmins) {
      return m.reply('*📛 The bot needs admin powers to do this, fam.*');
    }

    if (!text) return m.reply(`*📛 Enter the number you wanna invite, dude.*\n\nExample:\n*${prefix + cmd}* 919142294671`);
    if (text.includes('+')) return m.reply(`*📛 Drop the + sign, just give me the digits.*`);
    if (isNaN(text)) return m.reply(`*📛 Numbers only, my man. And don't forget the country code.*`);

    const link = 'https://chat.whatsapp.com/' + await gss.groupInviteCode(group);
    const inviteMessage = `≡ *GROUP INVITATION* 🎉\n\nYou got an invite to join the group "${groupMetadata.subject}".\n\n👉 Invite Link: ${link}\n\nInvited by: @${m.sender.split('@')[0]}`;

    await gss.sendMessage(`${text}@s.whatsapp.net`, { text: inviteMessage, mentions: [m.sender] });
    m.reply(`*☑️ Invite link sent, my dude.*`);

  } catch (error) {
    console.error('Error:', error);
    m.reply('💥 Something went wrong, bro.');
  }
};

export default invite;