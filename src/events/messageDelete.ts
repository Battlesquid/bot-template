import axios from "axios";
import {
  Attachment,
  ChannelType,
  Colors,
  EmbedBuilder,
  Events,
  Message,
  TextChannel
} from "discord.js";
import { Stream } from "stream";
import { Event } from ".";
import BotClient from "../client";
import LoggingSettings from "../entities/LoggingSettings";

const logAttachment = async (log: TextChannel, msg: Message, attach: Attachment) => {
  const bytes: Uint8Array[] = [];
  const response = await axios.request<Stream>({
    method: "get",
    url: attach.proxyURL,
    responseType: "stream",
  });
  response.data.on("data", (d) => bytes.push(d));
  response.data.on("end", () => {
    const buffer = Buffer.concat(bytes);
    const ext =
            attach.contentType?.match(
              "png|jpg|jpeg|gif|webp"
            ) ?? "png";

    const embed = new EmbedBuilder()
      .setTitle("Image Deleted")
      .setDescription(
        `Sent by ${msg.member} in ${msg.channel}`
      )
      .setColor(Colors.DarkRed)
      .setImage(`attachment://deleted.${ext}`)
      .setTimestamp(Date.now());

    log.send({
      embeds: [embed],
      files: [
        {
          attachment: buffer,
          name: `deleted.${ext}`,
          description: `deleted by ${msg.member} in ${msg.channel}`,
        },
      ],
    });
  });
};

const event: Event<Events.MessageDelete> = {
  name: Events.MessageDelete,
  handle: async (client: BotClient, msg: Message) => {
    const em = client.orm.em.fork();
    const settings = await em.findOne(LoggingSettings, {
      guild_id: msg.guildId,
    });

    if (!settings) return;

    if (settings.img_log) {
      const logChannel = await msg.guild?.channels.fetch(settings.img_log);
      if (logChannel?.type !== ChannelType.GuildText) return;

      const filtered = msg.attachments.filter((attach) => {
        return attach.contentType?.match("png|jpg|jpeg|gif|webp");
      });
      filtered.forEach((attach) => {
        logAttachment(logChannel, msg, attach);
      });
    }

    if (settings.txt_log) {
      if (msg.content === "") return;

      const logChannel = await msg.guild?.channels.fetch(settings.txt_log);
      if (logChannel?.type !== ChannelType.GuildText) return;

      const msgs = await msg.channel.messages.fetch({
        before: msg.id,
        limit: 1,
      });

      const first = msgs.first();
      const context = first
        ? `[Jump to context](${first.url})`
        : "`No context available`";

      const embed = new EmbedBuilder()
        .setTitle("Message Deleted")
        .setDescription(
          `
                    Sent by ${msg.author} in ${msg.channel}
                    
                    ${msg.content}
                    
                    ${context}
                    `
        )
        .setColor(Colors.DarkRed)
        .setTimestamp(Date.now());
      logChannel.send({ embeds: [embed] });
    }
  },
};

export default event;
