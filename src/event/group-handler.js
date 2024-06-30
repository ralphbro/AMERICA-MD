import moment from 'moment-timezone';
import config from '../../config.cjs';

export default async function GroupParticipants(sock, { id, participants, action }) {
   try {
      const metadata = await sock.groupMetadata(id);

      // Loop through participants
      for (const jid of participants) {
         let profile;
         try {
            profile = await sock.profilePictureUrl(jid, "image");
         } catch {
            profile = "https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu"; // Replace with your default profile picture URL
         }

         // Determine the action (add or remove)
         if (action === "add" && config.WELCOME) {
            const userName = jid.split("@")[0];
            const joinTime = moment.tz('America/New_York').format('h:mm A');
            const joinDate = moment.tz('America/New_York').format('dddd, MMMM D, YYYY');

            // Thug-style welcome message
            const welcomeMessage = `🎉 Yo @${userName}, welcome to ${metadata.subject}! 🌟\n\n`;
            const memberInfo = `👥 You're now one of the ${metadata.participants.length} crew.\n`;
            const joinInfo = `⏰ Joined at ${joinTime} on ${joinDate}.\n\n`;

            // Send thug-style welcome message privately to the user
            await sock.sendMessage(jid, {
               text: welcomeMessage + memberInfo + joinInfo,
               contextInfo: {
                  externalAdReply: {
                     title: `Welcome to ${metadata.subject}`,
                     mediaType: 1,
                     previewType: 0,
                     renderLargerThumbnail: true,
                     thumbnailUrl: profile,
                     sourceUrl: 'https://github.com/andymrlit'
                  }
               }
            });
         } else if (action === "remove" && config.WELCOME) {
            const userName = jid.split('@')[0];
            const leaveTime = moment.tz('America/New_York').format('h:mm A');
            const leaveDate = moment.tz('America/New_York').format('dddd, MMMM D, YYYY');

            // Thug-style goodbye message
            const goodbyeMessage = `😢 Yo @${userName}, peace out from ${metadata.subject}! 💔\n\n`;
            const memberInfo = `👥 Now we're down to ${metadata.participants.length} in the crew.\n`;
            const leaveInfo = `⏰ Left at ${leaveTime} on ${leaveDate}.\n\n`;

            // Send thug-style goodbye message privately to the user
            await sock.sendMessage(jid, {
               text: goodbyeMessage + memberInfo + leaveInfo,
               contextInfo: {
                  externalAdReply: {
                     title: `Peace out from ${metadata.subject}`,
                     mediaType: 1,
                     previewType: 0,
                     renderLargerThumbnail: true,
                     thumbnailUrl: profile,
                     sourceUrl: 'https://github.com/andymrlit'
                  }
               }
            });
         }
      }
   } catch (e) {
      throw e;
   }
}