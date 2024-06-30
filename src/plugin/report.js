const report = async (m, gss) => {
  const reportedMessages = {};
  const devlopernumber = '13092208152';
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['bug', 'report', 'request']; 
  
  if (validCommands.includes(cmd)) {
    
    if (!text) return m.reply(`Example: ${prefix + cmd} Yo, dev, this command ain't workin' right.`);

    const messageId = m.key.id;

    if (reportedMessages[messageId]) {
      return m.reply("Yo, you already snitched on this one. Hold tight and wait for a reply.");
    }

    reportedMessages[messageId] = true;

    const textt = `*| REQUEST/BUG |*`;
    const teks1 = `\n\n*User*: @${m.sender.split("@")[0]}\n*Request/Bug*: ${text}`;
    const teks2 = `\n\n*Yo ${m.pushName}, your message is sent to the big boss. Sit tight...*`;

    gss.sendMessage(devlopernumber + "@s.whatsapp.net", {
      text: textt + teks1,
      mentions: [m.sender],
    }, {
      quoted: m,
    });

    m.reply("Good lookin' out. The boss got your message. Hold tight for a response.");
  }
};

export default report;