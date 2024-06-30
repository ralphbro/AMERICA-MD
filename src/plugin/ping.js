import { performance } from 'perf_hooks';

const ping = async (m, sock) => {
  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';

  if (cmd === "ping") {
    // Function to measure ping
    const measurePing = async () => {
      const start = performance.now();
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulating some async operation
      const end = performance.now();
      return Math.round(end - start);
    };
    
    const ping = await measurePing();
    const emojis = ['🚀', '🔥', '💨', '🕶️', '🤙']; // Emojis for added flair

    const text = `Yo, I'm lightning fast, bro! ${ping} ms ${emojis[Math.floor(Math.random() * emojis.length)]}`;
    await sock.sendMessage(m.from, { text }, { quoted: m });

    await m.React('⚡');
  }
}

export default ping;