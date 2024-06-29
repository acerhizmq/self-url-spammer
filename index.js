const Self = global.Self = require("discord.js-selfbot-v13");
const Selfb = global.Selfb = new Self.Client({
	ws: { properties: { $browser: "Discord iOS" } },
});
const Discord = global.Discord = require("discord.js");
const system = require("./konfig.json")

const botklient = new Discord.Client({
  intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.GuildEmojisAndStickers, Discord.GatewayIntentBits.GuildIntegrations, Discord.GatewayIntentBits.GuildWebhooks, Discord.GatewayIntentBits.GuildInvites, Discord.GatewayIntentBits.GuildVoiceStates, Discord.GatewayIntentBits.GuildPresences, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildMessageReactions, Discord.GatewayIntentBits.GuildMessageTyping, Discord.GatewayIntentBits.DirectMessages, Discord.GatewayIntentBits.DirectMessageReactions, Discord.GatewayIntentBits.DirectMessageTyping, Discord.GatewayIntentBits.MessageContent],
});

await botklient.login(system.bottoken);

Selfb.on('ready', () => {
  console.log(`Başarıyla ${Selfb.user.tag} adlı hesaba giriş yapıldı.`);

 /* Selfb.user.setPresence({
    status: system.selftokendurum, //'online', 'idle', 'dnd', veya 'invisible'
        activities: [
          {
          name:  system.selftokenstatus,
          type: 'PLAYING', //(PLAYING, STREAMING, LISTENING, WATCHING, COMPETING)
          url: 'https://www.twitch.tv/acerhizm'
          }
      ]
  });*/

  //Selfb.user.setPresence({ activities: [{ name: system.selftokenstatus }], status: 'online' });
  Selfb.user.setStatus(system.selftokendurum);
  Selfb.settings.setCustomStatus({ text: system.selftokenstatus, status: system.selftokendurum, expires: null });

});

  //spammer
  async function guildUpdateEvent(oldGuild, newGuild) {
      try {
          const Data = require("./konfig.json")
  
          if (!Data || !Data.url || !Data.token) return;
  
          const auditLogs = await newGuild.fetchAuditLogs({ limit: 1, type: Discord.AuditLogEvent.GuildUpdate });
          const entry = auditLogs.entries.first();
  
          if (!entry || !entry.executor) {
              let log0 = client.channels.cache.find(x => x.name.includes("guard") || x.name == "guard-log");
              if (log0) {
                  log0.send({
                      content: "Sunucu Güncellendi.",
                      embeds: [
                          new Discord.EmbedBuilder()
                              .setColor("Random")
                              .setAuthor({ name: newGuild.name, iconURL: newGuild.iconURL({ dynamic: true }) })
                              .setDescription(`Url değiştiğine dair denetim kaydında bir kayıt bulamadım, değişikliği yapan kişi <@${entry.executor.id}>.`)
                              .setFooter({ text: "Ama yinede iyi ilerledim :(" })
                      ]
                  });
              }
              console.error("Url değiştiğine dair denetim kaydında bir kayıt bulamadım.");
              return; 
          }
  
          const executorId = entry.executor.id;
  
          const isAuthorized =  [""].includes(executorId); //safe list
  
          if (isAuthorized) {
              let log1 = client.channels.cache.find(x => x.name.includes("guard") || x.name == "guard-log");
              if (log1) {
                  log1.send({
                      content: "@everyone",
                      embeds: [
                          new Discord.EmbedBuilder()
                              .setColor("Random")
                              .setAuthor({ name: newGuild.name, iconURL: newGuild.iconURL({ dynamic: true }) })
                              .setDescription(`**${newGuild.name}** **URL** yetkili bir şekilde değiştirildi. Urlyi değiştirmedim değişikliği yapan kişi <@${entry.executor.id}>.`)
                              .setFooter({ text: "Baş edemezsiniz orospu çocukları" })
                      ]
                  });
              }
              return; 
          }
  
          const log = client.channels.cache.find(x => x.name.includes("guard") || x.name == "guard-log");
          if (log) {
              log.send({
                  content: "@everyone",
                  embeds: [
                      new Discord.EmbedBuilder()
                          .setColor("Random")
                          .setAuthor({ name: newGuild.name, iconURL: newGuild.iconURL({ dynamic: true }) })
                          .setDescription(`**${newGuild.name}** **URL** yetkisiz bir şekilde değiştirildi. URL eski haline getirildi ve değişikliği yapan kişi <@${entry.executor.id}> sunucu sahibi üzerinden banlandı.`)
                          .setFooter({ text: "Baş edemezsiniz orospu çocukları" })
                  ]
              });
          }
  
          for (const self_token of Data.token) {
              await request({
                  method: "PATCH",
                  url: `https://discord.com/api/v10/guilds/${Data.sunucuid}/vanity-url`,
                  headers: {
                      "Authorization": `${Data.token}`,
                      "User-Agent": `Cartel und Acer Spammer`,
                      "Content-Type": `application/json`,
                      "X-Audit-Log-Reason": `URL Spammer`
                  },
                  body: { "code": Data.url },
                  json: true
              });
          }
          
          const spuni = global.spuni = async function (id, type) {
            const guild = Selfb.guilds.cache.get(system.Guild.ID);
            const uye = guild.members.cache.get(id);
            if (!uye) return;
            if (type == "sban") return await uye.ban({ reason: "Yermiyiz sandın orospu evladı :D" }).catch(err => { })
          }

          await spuni(executorId, "sban");
      } catch (error) {
          console.error("Url spammerda hata:", error);
      }
  }
  
  Selfb.on("guildUpdate", guildUpdateEvent);
  
  //spammer
  
  Selfb.login(system.token).catch(e => {
      console.log(`${Selfb.user.tag} adlı hesaba giriş yapılamadı.`)
  })
